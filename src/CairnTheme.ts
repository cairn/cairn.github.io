/**
 * The Cairn theme for Astryx, as used on cairn.github.io.
 *
 * Every colour comes from this site's own palette (the dark slate
 * surfaces, the paper off-white text, and the coral brand from the
 * original style.css), stepped into Astryx tokens. It is the same theme
 * the cairn-gui web preview adopted, so the studio's properties share
 * one visual system. Dark values are the site's exact tokens; light
 * values are the same hues stepped for the paper side of the brand.
 * Typography: Space Grotesk for headings and the wordmark, the platform
 * system font for interface text.
 */
import {defineTheme} from '@astryxdesign/core/theme';

type Pair = [string, string];

const hue = (bg: Pair, strong: Pair) => ({bg, strong});

const hues = {
  gray: hue(['#e8e4de', '#2a3038'], ['#5c564e', '#b5b4b5']),
  orange: hue(['#f6e0d4', '#3a2a24'], ['#c25e3f', '#e69a80']),
  red: hue(['#f6dcd9', '#3a2426'], ['#c2433c', '#ef7d76']),
  green: hue(['#dde8dd', '#24352a'], ['#4c7a54', '#7fb685']),
  blue: hue(['#dbe5ee', '#24313d'], ['#3f6d99', '#7ea6c9']),
  yellow: hue(['#f3e5c8', '#38301d'], ['#a86f1f', '#e0a458']),
  teal: hue(['#d8eae6', '#1f3230'], ['#35705f', '#6fb3a4']),
  cyan: hue(['#d9edf2', '#1f3038'], ['#2f7186', '#72b7c9']),
  purple: hue(['#e6ddf0', '#2d2438'], ['#6d4f9e', '#a68fd0']),
  pink: hue(['#f4dce6', '#38242e'], ['#a8436a', '#d07ea4']),
} as const;

type HueName = keyof typeof hues;

const hueTokens = (role: string, pick: (h: (typeof hues)[HueName]) => Pair) =>
  Object.fromEntries(
    (Object.keys(hues) as HueName[]).map(name => [
      `--color-${role}-${name}`,
      pick(hues[name]),
    ]),
  );

export const cairnTheme = defineTheme({
  name: 'cairn',

  typography: {
    scale: {base: 16, ratio: 1.35},
    body: {
      family: 'system-ui',
      fallbacks:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    heading: {
      family: 'Space Grotesk',
      fallbacks: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      weights: {1: 'bold', 2: 'bold', 3: 'bold', 4: 'bold'},
    },
    code: {
      family: 'ui-monospace',
      fallbacks:
        '"SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },

  motion: {fast: 125, medium: 300, slow: 700, ratio: 0.75},

  tokens: {
    // Surfaces: the app's slate steps, darkest at the rail.
    '--color-background-body': ['#f5f1ec', '#181c23'],
    '--color-background-surface': ['#faf7f2', '#12151b'],
    '--color-background-card': ['#fdfbf8', '#1e232b'],
    '--color-background-popover': ['#fdfbf8', '#1e232b'],
    '--color-background-muted': ['#efe9e2', '#242a32'],

    // The coral brand is the accent in both modes: the darker step on
    // paper, the gui's lighter accent step on slate, dark text on both
    // (the gui's own accentText pairing).
    '--color-accent': ['#d97757', '#e69a80'],
    '--color-on-accent': ['#181c23', '#181c23'],
    '--color-accent-muted': ['#f3ddd2', '#3a2a24'],
    '--color-text-accent': ['#c25e3f', '#e69a80'],
    '--color-icon-accent': ['#c25e3f', '#e69a80'],

    '--color-neutral': ['#181c230F', '#f0ece81A'],

    '--color-overlay': ['#181c2380', '#000000CC'],
    '--color-overlay-hover': ['#181c230D', '#f0ece80D'],
    '--color-overlay-pressed': ['#181c231A', '#f0ece81A'],

    '--color-text-primary': ['#181c23', '#f0ece8'],
    '--color-text-secondary': ['#5c564e', '#b5b4b5'],
    '--color-text-disabled': ['#a39e96', '#75706c'],
    '--color-on-dark': '#f5f1ec',
    '--color-on-light': '#181c23',

    // Status roles from the app's danger and success, a warm amber for
    // warning, and a muted steel blue for info (the one hue the brand
    // palette does not carry; chosen to sit quietly on the slate).
    '--color-success': ['#4c7a54', '#7fb685'],
    '--color-error': ['#c2433c', '#ef7d76'],
    '--color-warning': ['#a86f1f', '#e0a458'],
    '--color-info': ['#3f6d99', '#7ea6c9'],
    '--color-on-success': ['#ffffff', '#181c23'],
    '--color-on-error': ['#ffffff', '#181c23'],
    '--color-on-warning': '#181c23',
    '--color-on-info': ['#ffffff', '#181c23'],
    '--color-text-success': ['#4c7a54', '#7fb685'],
    '--color-text-error': ['#c2433c', '#ef7d76'],
    '--color-text-warning': ['#a86f1f', '#e0a458'],
    '--color-text-info': ['#3f6d99', '#7ea6c9'],
    '--color-success-muted': ['#dde8dd', '#7fb6853D'],
    '--color-error-muted': ['#f6dcd9', '#ef7d763D'],
    '--color-warning-muted': ['#f3e5c8', '#e0a4583D'],
    '--color-info-muted': ['#dbe5ee', '#7ea6c93D'],
    '--color-on-success-muted': ['#4c7a54', '#7fb685'],
    '--color-on-error-muted': ['#c2433c', '#ef7d76'],
    '--color-on-warning-muted': ['#a86f1f', '#e0a458'],
    '--color-on-info-muted': ['#3f6d99', '#7ea6c9'],

    '--color-icon-primary': ['#181c23', '#f0ece8'],
    '--color-icon-secondary': ['#5c564e', '#b5b4b5'],
    '--color-icon-disabled': ['#a39e96', '#75706c'],

    // The gui draws a solid border on slate; paper takes an ink tint.
    '--color-border': ['#181c231F', '#3b4149'],
    '--color-border-emphasized': ['#d8d2c9', '#565e68'],

    '--color-skeleton': ['#efe9e2', '#2a3038'],
    '--color-shadow': ['#181c231A', '#0000004D'],
    '--color-tint-hover': ['#181c23', '#f0ece8'],

    // Hue families for tinted surfaces and status-adjacent components.
    ...hueTokens('background', h => h.bg),
    ...hueTokens('border', h => h.strong),
    ...hueTokens('icon', h => h.strong),
    ...hueTokens('text', h => h.strong),

    // Radii match the app's own steps (radius 12, radiusLarge 18).
    '--radius-none': '0px',
    '--radius-inner': '0.375rem',
    '--radius-element': '0.625rem',
    '--radius-container': '0.75rem',
    '--radius-page': '1.125rem',
    '--radius-full': '9999px',

    '--shadow-low':
      '0 2px 4px light-dark(oklch(0 0 0 / 5%), oklch(0 0 0 / 25%)), ' +
      '0 4px 8px light-dark(oklch(0 0 0 / 10%), oklch(0 0 0 / 40%)), ' +
      'inset 0 0 0 1px light-dark(transparent, oklch(1 0 0 / 8%))',
    '--shadow-med':
      '0 4px 8px light-dark(oklch(0 0 0 / 8%), oklch(0 0 0 / 35%)), ' +
      '0 8px 16px light-dark(oklch(0 0 0 / 12%), oklch(0 0 0 / 50%)), ' +
      'inset 0 0 0 1px light-dark(transparent, oklch(1 0 0 / 12%))',
    '--shadow-high':
      '0 8px 16px light-dark(oklch(0 0 0 / 10%), oklch(0 0 0 / 50%)), ' +
      '0 16px 32px light-dark(oklch(0 0 0 / 15%), oklch(0 0 0 / 70%)), ' +
      'inset 0 0 0 1px light-dark(transparent, oklch(1 0 0 / 15%))',
  },
});
