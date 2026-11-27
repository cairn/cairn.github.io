/**
 * The hero cairn, animated: cairn-code's Braille 3D dot-array logo,
 * ported from `src/tui/idle_animation.rs` in the cairn-code repo.
 *
 * The port is mechanical. The same nine spheres (radius 0.32, centres
 * in a 1-3-5 pyramid) are ray-cast per Braille dot under a parallel
 * projection, shaded by the same studio light, and turned by the same
 * motion state machine: a 3 s startup ease from -0.10 rad, a
 * drag-to-spin gesture with an exponential approach to the drag speed,
 * and a spring wobble on release that settles on the nearest whole
 * revolution. Frames advance on the same 50 ms tick, and each cell's
 * colour is the average of its occupied dots' shaded colours.
 *
 * The changes are only the ones the web forces. The terminal cell grid
 * becomes a canvas capped at the same 48x24 cells, with the grid
 * centred in the hero graphic's box. A terminal font pitches its
 * Braille dots on the cell; a web symbol font does not, so the glyph
 * is measured once and scaled onto the grid's dot pitch. The clock
 * freezes while the hero is off-screen or the tab is hidden, so the
 * motion never jumps. `prefers-reduced-motion` renders the static
 * front pose, angle 0, with no ticking and no gesture, exactly as
 * the TUI does.
 */
import {useEffect, useRef} from 'react';

import * as stylex from '@stylexjs/stylex';

// The constants, named and valued as in idle_animation.rs.
const TICK_MS = 50;
const ANIMATION_MS = 3000;
const START_ANGLE = -0.1;
const SPRING_DAMPING = 2.0;
const SPRING_FREQUENCY = 3.0;
const SPIN_SPEED = 1.0;
const MAX_SPIN_SPEED = 3.0;
const SPIN_RESPONSE = 5.0;
const MAX_WIDTH = 48;
const MAX_HEIGHT = 24;
const SCENE_DEPTH = 6.0;
const SPHERE_RADIUS = 0.32;
const SCENE_MID_Y = 0.35;
const TAU = Math.PI * 2;

type Vec3 = [number, number, number];

const SPHERE_CENTERS: Vec3[] = [
  [0, 1.2, 0],
  [-0.7, 0.35, 0],
  [0, 0.35, 0],
  [0.7, 0.35, 0],
  [-1.4, -0.5, 0],
  [-0.7, -0.5, 0],
  [0, -0.5, 0],
  [0.7, -0.5, 0],
  [1.4, -0.5, 0],
];

/** The view direction for every ray: the camera is infinitely far away. */
const VIEW: Vec3 = [0, 0, -1];

/**
 * The accent the shading formula is fed: the site's solid coral,
 * `coralSolid` (#d97757) in siteTokens.stylex.ts, which is the exact
 * colour of the nine flat hero dots this animation replaces (sampled
 * from the old hero image to confirm the match).
 */
const ACCENT: Vec3 = [0xd9 / 255, 0x77 / 255, 0x57 / 255];

/**
 * Fonts that actually carry the Braille Patterns block, in the order
 * the platforms ship them: Windows, Android and ChromeOS (both
 * spellings of the Noto family name occur), macOS, Linux, then any
 * monospace.
 */
const FONT_STACK =
  '"Segoe UI Symbol", "Noto Sans Symbols 2", "Noto Sans Symbols2", "Apple Symbols", "DejaVu Sans", monospace';

/**
 * The dot geometry of the full Braille cell (U+28FF) in whichever font
 * the stack resolves to, measured once at a reference size: the
 * glyph's advance, the pitch and offset of its two dot columns, and
 * the pitch of its four dot rows with the top row's distance above
 * the alphabetic baseline. No two symbol fonts agree on this geometry,
 * and none of them pitch their dots at the cell size the projection
 * assumes, so the renderer measures the real glyph and scales it onto
 * the ideal grid (see `layout`). Returns null when the glyph does not
 * resolve to a clean 2x4 dot block.
 */
interface GlyphGeometry {
  size: number;
  advance: number;
  colPitch: number;
  colOffset: number;
  rowPitch: number;
  topDist: number;
}

function measureGlyph(): GlyphGeometry | null {
  const size = 200;
  const probe = document.createElement('canvas');
  probe.width = 400;
  probe.height = 400;
  const g = probe.getContext('2d');
  if (g === null) {
    return null;
  }
  g.font = `${size}px ${FONT_STACK}`;
  const advance = g.measureText('\u28ff').width;
  g.textAlign = 'left';
  g.textBaseline = 'alphabetic';
  g.fillStyle = '#000';
  g.fillText('\u28ff', 50, 250);
  const data = g.getImageData(0, 0, 400, 400).data;
  const lit = (x: number, y: number) => data[(y * 400 + x) * 4 + 3] > 40;
  const clusters = (on: boolean[]): number[] => {
    const out: number[] = [];
    let start = -1;
    on.forEach((isOn, i) => {
      if (isOn && start < 0) {
        start = i;
      } else if (!isOn && start >= 0) {
        out.push((start + i - 1) / 2);
        start = -1;
      }
    });
    if (start >= 0) {
      out.push((start + on.length - 1) / 2);
    }
    return out;
  };
  const rowOn: boolean[] = [];
  for (let y = 0; y < 400; y++) {
    let on = false;
    for (let x = 0; x < 400 && !on; x++) {
      on = lit(x, y);
    }
    rowOn.push(on);
  }
  const colOn: boolean[] = [];
  for (let x = 0; x < 400; x++) {
    let on = false;
    for (let y = 0; y < 400 && !on; y++) {
      on = lit(x, y);
    }
    colOn.push(on);
  }
  const rows = clusters(rowOn);
  const cols = clusters(colOn);
  if (rows.length !== 4 || cols.length !== 2) {
    return null;
  }
  return {
    size,
    advance,
    colPitch: cols[1] - cols[0],
    colOffset: cols[0] - 50,
    rowPitch: (rows[3] - rows[0]) / 3,
    topDist: 250 - rows[0],
  };
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function scaled(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s];
}

function minus(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalized(a: Vec3): Vec3 {
  return scaled(a, 1 / Math.sqrt(dot(a, a)));
}

/** The standard Unicode dot-bit mapping, as in the Rust `braille` module. */
function dotBit(row: number, col: number): number {
  if (col === 0) {
    return [0x01, 0x02, 0x04, 0x40][row] ?? 0;
  }
  return [0x08, 0x10, 0x20, 0x80][row] ?? 0;
}

function rotateY(point: Vec3, angle: number): Vec3 {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  return [
    point[0] * cos + point[2] * sin,
    point[1],
    -point[0] * sin + point[2] * cos,
  ];
}

function cameraCenters(angle: number): Vec3[] {
  return SPHERE_CENTERS.map(center => {
    const rotated = rotateY(center, angle);
    return [rotated[0], rotated[1] - SCENE_MID_Y, rotated[2] + SCENE_DEPTH];
  });
}

interface Hit {
  depth: number;
  normal: Vec3;
}

/**
 * Where the ray through the screen point (x, y) first meets a stone.
 * The projection is parallel rather than a divide by depth, so the
 * pile is symmetric at every angle and the turn never jolts.
 */
function stoneHit(x: number, y: number, center: Vec3, radius: number): Hit | null {
  const offsetX = center[0] - x;
  const offsetY = center[1] - y;
  const squared = offsetX * offsetX + offsetY * offsetY;
  const radiusSquared = radius * radius;
  if (squared > radiusSquared) {
    return null;
  }
  const height = Math.sqrt(radiusSquared - squared);
  const depth = center[2] - height;
  if (depth <= 0) {
    return null;
  }
  const inv = 1 / radius;
  return {
    depth,
    normal: [-offsetX * inv, -offsetY * inv, -height * inv],
  };
}

function nearestHit(x: number, y: number, centers: Vec3[]): Hit | null {
  let best: Hit | null = null;
  for (const center of centers) {
    const hit = stoneHit(x, y, center, SPHERE_RADIUS);
    if (hit !== null && (best === null || hit.depth < best.depth)) {
      best = hit;
    }
  }
  return best;
}

interface Projection {
  centers: Vec3[];
  dotsWide: number;
  dotsHigh: number;
  pitch: number;
  midX: number;
  midY: number;
}

function makeProjection(angle: number, cellsWide: number, cellsHigh: number): Projection {
  const centers = cameraCenters(angle);
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const center of centers) {
    minX = Math.min(minX, center[0] - SPHERE_RADIUS);
    maxX = Math.max(maxX, center[0] + SPHERE_RADIUS);
    minY = Math.min(minY, center[1] - SPHERE_RADIUS);
    maxY = Math.max(maxY, center[1] + SPHERE_RADIUS);
  }
  const dotsWide = cellsWide * 2;
  const dotsHigh = cellsHigh * 4;
  // A 2:1 cell gives approximately square Braille dot spacing. The
  // extents are the layout's, carried up by the margin the depth
  // divide used to add, keeping the logo the size it has always been.
  const closest = SCENE_DEPTH - 1.4 * Math.sin(Math.PI / 6) - SPHERE_RADIUS;
  const margin = SCENE_DEPTH / closest;
  const sceneWidth = 2.0 * (1.4 + SPHERE_RADIUS) * margin;
  const sceneHeight = 2.0 * (0.85 + SPHERE_RADIUS) * margin;
  const pitch = Math.max(
    sceneWidth / Math.max(dotsWide - 4, 1),
    sceneHeight / Math.max(dotsHigh - 4, 1),
  );
  return {
    centers,
    dotsWide,
    dotsHigh,
    pitch,
    midX: (minX + maxX) * 0.5,
    midY: (minY + maxY) * 0.5,
  };
}

/** Where a dot lands on the screen plane, in scene units. */
function screenPoint(p: Projection, x: number, y: number): [number, number] {
  return [
    (x + 0.5 - p.dotsWide * 0.5) * p.pitch + p.midX,
    (p.dotsHigh * 0.5 - y - 0.5) * p.pitch + p.midY,
  ];
}

const KEY_LIGHT = normalized([-0.25, 0.9, -0.65]);
const BOUNCE_LIGHT = normalized([0.45, -0.3, -0.25]);

function shade(normalVec: Vec3): Vec3 {
  const diffuse = Math.max(dot(normalVec, KEY_LIGHT), 0);
  const bounce = Math.max(dot(normalVec, BOUNCE_LIGHT), 0) * (1 - diffuse);
  const rim = Math.pow(1 - Math.min(Math.max(dot(normalVec, VIEW), 0), 1), 3);
  const half = normalized(minus(KEY_LIGHT, scaled(VIEW, -1)));
  const gloss = Math.pow(Math.max(dot(normalVec, half), 0), 24);
  const intensity = 0.23 + diffuse * 0.7 + bounce * 0.12 + rim * 0.1;
  return ACCENT.map(channel =>
    Math.min(Math.max(channel * intensity + (1 - channel) * gloss * 0.35, 0), 1),
  ) as Vec3;
}

interface FrameCell {
  glyph: string;
  color: string;
}

interface Frame {
  masks: Uint8Array;
  cells: (FrameCell | null)[];
}

function renderFrame(angle: number, cellsWide: number, cellsHigh: number): Frame {
  const width = Math.min(cellsWide, MAX_WIDTH);
  const height = Math.min(cellsHigh, MAX_HEIGHT);
  const projection = makeProjection(angle, width, height);
  const masks = new Uint8Array(width * height);
  const cells: (FrameCell | null)[] = new Array(width * height).fill(null);
  for (let cellY = 0; cellY < height; cellY++) {
    for (let cellX = 0; cellX < width; cellX++) {
      let mask = 0;
      const rgbSum = [0, 0, 0];
      let occupied = 0;
      for (let dotY = 0; dotY < 4; dotY++) {
        for (let dotX = 0; dotX < 2; dotX++) {
          const [x, y] = screenPoint(
            projection,
            cellX * 2 + dotX,
            cellY * 4 + dotY,
          );
          const hit = nearestHit(x, y, projection.centers);
          if (hit !== null) {
            mask |= dotBit(dotY, dotX);
            occupied += 1;
            const shaded = shade(hit.normal);
            rgbSum[0] += shaded[0];
            rgbSum[1] += shaded[1];
            rgbSum[2] += shaded[2];
          }
        }
      }
      const index = cellY * width + cellX;
      masks[index] = mask;
      if (mask !== 0) {
        const r = Math.round((rgbSum[0] / occupied) * 255);
        const g = Math.round((rgbSum[1] / occupied) * 255);
        const b = Math.round((rgbSum[2] / occupied) * 255);
        cells[index] = {
          glyph: String.fromCharCode(0x2800 + mask),
          color: `rgb(${r}, ${g}, ${b})`,
        };
      }
    }
  }
  return {masks, cells};
}

// -- Motion, the IdleAnimation state machine ---------------------------

interface MotionState {
  angle: number;
  velocity: number;
}

type Motion =
  | {kind: 'startup'}
  | {kind: 'wobble'; initial: MotionState; restAngle: number}
  | {kind: 'spin'; initial: MotionState; targetSpeed: number};

function normalizedAngle(angle: number): number {
  let a = angle;
  if (Math.abs(a) > Math.PI) {
    a = (((a + Math.PI) % TAU) + TAU) % TAU - Math.PI;
  }
  return a === 0 ? 0 : a;
}

function wobbleAt(state: MotionState, elapsedSec: number): MotionState {
  if (elapsedSec <= 0) {
    return state;
  }
  if (elapsedSec >= ANIMATION_MS / 1000) {
    return {angle: 0, velocity: 0};
  }
  const sin = Math.sin(SPRING_FREQUENCY * elapsedSec);
  const cos = Math.cos(SPRING_FREQUENCY * elapsedSec);
  const decay = Math.exp(-SPRING_DAMPING * elapsedSec);
  const coefficient = (state.velocity + SPRING_DAMPING * state.angle) / SPRING_FREQUENCY;
  const angle = decay * (state.angle * cos + coefficient * sin);
  const velocity =
    decay *
    ((SPRING_FREQUENCY * coefficient - SPRING_DAMPING * state.angle) * cos -
      (SPRING_FREQUENCY * state.angle + SPRING_DAMPING * coefficient) * sin);
  const fadeTime = Math.max(elapsedSec - (ANIMATION_MS / 1000 - 1), 0);
  const fade = 1 - fadeTime * fadeTime * (3 - 2 * fadeTime);
  const fadeVelocity = -6 * fadeTime * (1 - fadeTime);
  return {
    angle: angle * fade,
    velocity: velocity * fade + angle * fadeVelocity,
  };
}

function motionStateAt(motion: Motion, elapsedMs: number): MotionState {
  switch (motion.kind) {
    case 'startup': {
      const progress = Math.min(elapsedMs / ANIMATION_MS, 1);
      return {
        angle: START_ANGLE * (1 - progress * progress * (3 - 2 * progress)),
        velocity:
          (-START_ANGLE * 6 * progress * (1 - progress)) / (ANIMATION_MS / 1000),
      };
    }
    case 'wobble': {
      if (elapsedMs === 0) {
        return motion.initial;
      }
      const state = wobbleAt(
        {angle: motion.initial.angle - motion.restAngle, velocity: motion.initial.velocity},
        elapsedMs / 1000,
      );
      state.angle += motion.restAngle;
      return state;
    }
    case 'spin': {
      if (elapsedMs === 0) {
        return motion.initial;
      }
      const elapsed = elapsedMs / 1000;
      const decay = Math.exp(-SPIN_RESPONSE * elapsed);
      const delta = motion.initial.velocity - motion.targetSpeed;
      const angle =
        motion.initial.angle +
        motion.targetSpeed * elapsed +
        (delta * (1 - decay)) / SPIN_RESPONSE;
      return {
        angle: normalizedAngle(angle),
        velocity: motion.targetSpeed + delta * decay,
      };
    }
  }
}

/**
 * The animation clock and gesture state. Elapsed time is banked while
 * the hero is paused (off-screen or a hidden tab), so the motion math
 * only ever sees active time and never jumps.
 */
class CairnMotion {
  reduced: boolean;
  motion: Motion = {kind: 'startup'};
  /** The banked-clock reading when the current motion began. */
  startElapsed = 0;
  banked = 0;
  resumedAt: number | null = null;
  /** The quantized elapsed of the last painted frame, if any. */
  lastFrame: number | null = null;
  painted: MotionState = {angle: 0, velocity: 0};
  pressedColumn: number | null = null;

  constructor(reduced: boolean) {
    this.reduced = reduced;
  }

  now(): number {
    return this.banked + (this.resumedAt === null ? 0 : performance.now() - this.resumedAt);
  }

  resume() {
    if (this.resumedAt === null) {
      this.resumedAt = performance.now();
    }
  }

  pause() {
    if (this.resumedAt !== null) {
      this.banked = this.now();
      this.resumedAt = null;
    }
  }

  /** Time since the current motion began, unquantized. */
  elapsed(): number {
    return this.now() - this.startElapsed;
  }

  /** The elapsed of the frame to paint: whole 50 ms ticks, capped at
   * the animation duration for everything but a spin. */
  frameElapsed(): number {
    let e = this.elapsed();
    e -= e % TICK_MS;
    return this.motion.kind === 'spin' ? e : Math.min(e, ANIMATION_MS);
  }

  stateAt(elapsedMs: number): MotionState {
    if (this.reduced) {
      return {angle: 0, velocity: 0};
    }
    return motionStateAt(this.motion, elapsedMs);
  }

  needsTick(): boolean {
    return (
      !this.reduced &&
      (this.motion.kind === 'spin' || this.frameElapsed() < ANIMATION_MS)
    );
  }

  /** A press alone moves nothing; the caller checks the press landed
   * on a painted cell first, as `press_at` does. */
  press(column: number) {
    this.pressedColumn = column;
  }

  drag(column: number) {
    if (this.pressedColumn === null) {
      return;
    }
    const delta = column - this.pressedColumn;
    if (delta !== 0) {
      const initial = this.stateAt(this.elapsed());
      const direction = Math.sign(delta);
      const targetSpeed =
        direction * Math.min(SPIN_SPEED + Math.abs(delta) * 0.2, MAX_SPIN_SPEED);
      this.motion = {kind: 'spin', initial, targetSpeed};
      this.startElapsed = this.now();
      this.lastFrame = null;
      this.pressedColumn = column;
    }
  }

  release() {
    if (this.pressedColumn === null) {
      return;
    }
    this.pressedColumn = null;
    if (this.motion.kind === 'spin') {
      const initial =
        this.lastFrame !== null ? this.painted : this.stateAt(this.elapsed());
      const restAngle = Math.round(initial.angle / TAU) * TAU;
      this.motion = {kind: 'wobble', initial, restAngle};
      this.startElapsed = this.now();
      this.lastFrame = null;
    }
  }
}

// -- The component ------------------------------------------------------

const styles = stylex.create({
  canvas: {
    display: 'block',
    width: '100%',
    height: '100%',
    // Sideways drags spin the cairn; vertical drags still scroll.
    touchAction: 'pan-y',
    // A spin drag must never start a text selection or the iOS long
    // press callout: the canvas is a control, not prose.
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
  },
});

interface GridMetrics {
  cellsWide: number;
  cellsHigh: number;
  cellWidth: number;
  cellHeight: number;
  originX: number;
  originY: number;
  fontPx: number;
  /** The scale and offsets that land the measured glyph's dots on the
   * ideal grid; null when the glyph could not be measured, in which
   * case the renderer falls back to plain centred text. */
  glyph: {
    scaleX: number;
    scaleY: number;
    colOffset: number;
    topDist: number;
    dotPitch: number;
  } | null;
}

export function BrailleCairn() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motion = new CairnMotion(reduced);
    // The glyph geometry is size-independent; measure it once, and
    // again only if the font set settles differently after load.
    let geometryCache: GlyphGeometry | null | undefined;
    const geometry = () => {
      if (geometryCache === undefined) {
        geometryCache = measureGlyph();
      }
      return geometryCache;
    };
    let metrics: GridMetrics | null = null;
    let frame: Frame | null = null;
    let frameKey = '';
    let timer: number | null = null;
    let visible = false;
    let destroyed = false;

    const layout = () => {
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      if (cssWidth === 0 || cssHeight === 0) {
        metrics = null;
        return;
      }
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      // The grid is the Rust render area: capped at 48x24 cells and
      // centred in the box. Cells keep the 2:1 ratio the pitch math
      // assumes (a cell is two dot pitches wide, four tall), so the
      // whole grid spans 48 cell widths in both dimensions.
      const cellWidth = Math.min(cssWidth, cssHeight) / MAX_WIDTH;
      const cellHeight = cellWidth * 2;
      // The font is sized so its Braille advance is exactly one cell,
      // then the measured glyph is scaled per axis so its dot pitch
      // matches the grid's exactly: a symbol font's own dot pitch is
      // smaller than its advance, which would otherwise leave the
      // dots bunched inside each cell with a seam at every boundary.
      const measured = geometry();
      let fontPx = cellWidth * 5;
      let glyph: GridMetrics['glyph'] = null;
      if (measured !== null) {
        fontPx = (cellWidth * measured.size) / measured.advance;
        const unit = fontPx / measured.size;
        const dotPitch = cellWidth / 2;
        glyph = {
          scaleX: dotPitch / (measured.colPitch * unit),
          scaleY: dotPitch / (measured.rowPitch * unit),
          colOffset: measured.colOffset * unit,
          topDist: measured.topDist * unit,
          dotPitch,
        };
      } else {
        ctx.font = `100px ${FONT_STACK}`;
        const advanceAt100 = ctx.measureText('\u28ff').width;
        if (advanceAt100 > 0) {
          fontPx = (100 * cellWidth) / advanceAt100;
        }
      }
      metrics = {
        cellsWide: MAX_WIDTH,
        cellsHigh: MAX_HEIGHT,
        cellWidth,
        cellHeight,
        originX: (cssWidth - MAX_WIDTH * cellWidth) / 2,
        originY: (cssHeight - MAX_HEIGHT * cellHeight) / 2,
        fontPx,
        glyph,
      };
      frameKey = '';
    };

    const paint = () => {
      if (metrics === null) {
        return;
      }
      const frameElapsed = motion.frameElapsed();
      const state = motion.stateAt(frameElapsed);
      const angle = normalizedAngle(state.angle);
      const key = `${angle}|${metrics.cellsWide}x${metrics.cellsHigh}`;
      if (key !== frameKey) {
        frame = renderFrame(angle, metrics.cellsWide, metrics.cellsHigh);
        frameKey = key;
      }
      if (frame === null) {
        return;
      }
      const dpr = window.devicePixelRatio || 1;
      const {cellsWide, cellsHigh, cellWidth, cellHeight, originX, originY} = metrics;
      ctx.font = `${metrics.fontPx}px ${FONT_STACK}`;
      ctx.textAlign = 'left';
      if (metrics.glyph !== null) {
        // Draw in a space scaled per axis so the glyph's own dot pitch
        // becomes the grid's: each cell's first dot centre is placed
        // on its ideal grid point, and the rest follow by the scale.
        const {scaleX, scaleY, colOffset, topDist, dotPitch} = metrics.glyph;
        ctx.setTransform(dpr * scaleX, 0, 0, dpr * scaleY, 0, 0);
        ctx.clearRect(
          0,
          0,
          canvas.clientWidth / scaleX,
          canvas.clientHeight / scaleY,
        );
        ctx.textBaseline = 'alphabetic';
        for (let row = 0; row < cellsHigh; row++) {
          for (let col = 0; col < cellsWide; col++) {
            const cell = frame.cells[row * cellsWide + col];
            if (cell !== null) {
              ctx.fillStyle = cell.color;
              ctx.fillText(
                cell.glyph,
                (originX + (col * 2 + 0.5) * dotPitch) / scaleX - colOffset,
                (originY + (row * 4 + 0.5) * dotPitch) / scaleY + topDist,
              );
            }
          }
        }
      } else {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.textBaseline = 'middle';
        for (let row = 0; row < cellsHigh; row++) {
          for (let col = 0; col < cellsWide; col++) {
            const cell = frame.cells[row * cellsWide + col];
            if (cell !== null) {
              ctx.fillStyle = cell.color;
              ctx.fillText(
                cell.glyph,
                originX + col * cellWidth,
                originY + (row + 0.5) * cellHeight,
              );
            }
          }
        }
      }
      motion.lastFrame = frameElapsed;
      motion.painted = state;
    };

    const stopTimer = () => {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    const ensureTimer = () => {
      if (timer !== null || reduced || destroyed) {
        return;
      }
      timer = window.setInterval(() => {
        if (motion.frameElapsed() !== motion.lastFrame) {
          paint();
        }
        if (!motion.needsTick()) {
          stopTimer();
        }
      }, TICK_MS);
    };

    const startClock = () => {
      if (!visible || document.hidden || destroyed) {
        return;
      }
      motion.resume();
      paint();
      ensureTimer();
    };

    const stopClock = () => {
      motion.pause();
      stopTimer();
    };

    const cellAt = (event: PointerEvent): [number, number] | null => {
      if (metrics === null) {
        return null;
      }
      const rect = canvas.getBoundingClientRect();
      const col = Math.floor(
        (event.clientX - rect.left - metrics.originX) / metrics.cellWidth,
      );
      const row = Math.floor(
        (event.clientY - rect.top - metrics.originY) / metrics.cellHeight,
      );
      return [col, row];
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reduced || !event.isPrimary || event.button !== 0) {
        return;
      }
      // Claim every press that lands on the canvas, painted or not:
      // most of the box is empty space between the stones, and a drag
      // that starts there must still never become a text selection.
      event.preventDefault();
      if (motion.pressedColumn !== null) {
        return;
      }
      const cell = cellAt(event);
      if (cell === null || frame === null || metrics === null) {
        return;
      }
      const [col, row] = cell;
      // A press only counts on a painted cell, as in the TUI.
      if (
        col < 0 ||
        col >= metrics.cellsWide ||
        row < 0 ||
        row >= metrics.cellsHigh ||
        frame.masks[row * metrics.cellsWide + col] === 0
      ) {
        return;
      }
      motion.press(col);
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!event.isPrimary || motion.pressedColumn === null) {
        return;
      }
      const cell = cellAt(event);
      if (cell === null) {
        return;
      }
      motion.drag(cell[0]);
      ensureTimer();
    };

    const onPointerEnd = (event: PointerEvent) => {
      if (!event.isPrimary) {
        return;
      }
      motion.release();
      ensureTimer();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopClock();
      } else {
        startClock();
      }
    };

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        visible = entry.isIntersecting;
        if (visible) {
          startClock();
        } else {
          stopClock();
        }
      }
    });
    const resizeObserver = new ResizeObserver(() => {
      layout();
      paint();
    });

    layout();
    paint();
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    document.addEventListener('visibilitychange', onVisibilityChange);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerEnd);
    canvas.addEventListener('pointercancel', onPointerEnd);
    if (document.fonts !== undefined) {
      void document.fonts.ready.then(() => {
        if (!destroyed) {
          geometryCache = undefined;
          layout();
          paint();
        }
      });
    }

    return () => {
      destroyed = true;
      stopClock();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerEnd);
      canvas.removeEventListener('pointercancel', onPointerEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Cairn: nine coral dots arranged in a pyramid"
      {...stylex.props(styles.canvas)}>
      Cairn: nine coral dots arranged in a pyramid
    </canvas>
  );
}
