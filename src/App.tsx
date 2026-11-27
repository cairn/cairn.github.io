import {useState} from 'react';

import * as stylex from '@stylexjs/stylex';

import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {Text} from '@astryxdesign/core/Text';
import {TopNav} from '@astryxdesign/core/TopNav';
import {Theme} from '@astryxdesign/core/theme';
import {colorVars} from '@astryxdesign/core/theme/tokens.stylex';

import {BrailleCairn} from './BrailleCairn';
import {cairnTheme} from './CairnTheme';
import {siteVars} from './siteTokens.stylex';

/**
 * All of the site's own styling lives here as StyleX, driven by the
 * Cairn theme's Astryx tokens (colorVars) and the site tokens in
 * siteTokens.stylex.ts. Component styling (headings, text, buttons,
 * cards, badges, the top nav) comes from Astryx under the Cairn theme;
 * these styles are page layout and the bespoke illustrations the
 * components do not cover. Breakpoints mirror the site's original
 * responsive steps: 1500px, 1000px, and 700px.
 */
const styles = stylex.create({
  // The page surface: the body's slate, ink, and rhythm, carried by the
  // app root now that the Astryx reset and theme own the document base.
  page: {
    backgroundColor: colorVars['--color-background-body'],
    color: colorVars['--color-text-primary'],
    fontSynthesis: 'none',
    lineHeight: 1.6,
    minHeight: '100vh',
  },
  wrap: {
    width: {
      default: 'min(1184px, calc(100% - 96px))',
      '@media (max-width: 1000px)': 'calc(100% - 64px)',
      '@media (max-width: 700px)': 'calc(100% - 40px)',
    },
    marginInlineStart: 'auto',
    marginInlineEnd: 'auto',
  },
  // Plain anchors: the accent hover, underline offset, and the visible
  // focus ring every link on the site shares. Astryx-rendered anchors
  // keep the library's own states.
  link: {
    color: {default: 'inherit', ':hover': colorVars['--color-accent']},
    textUnderlineOffset: 5,
    outlineWidth: {default: null, ':focus-visible': 3},
    outlineStyle: {default: null, ':focus-visible': 'solid'},
    outlineColor: {
      default: null,
      ':focus-visible': colorVars['--color-accent'],
    },
    outlineOffset: {default: null, ':focus-visible': 6},
  },
  // The focus ring alone, for Astryx controls the plain-CSS rule used
  // to reach (the two Buttons).
  focusRing: {
    outlineWidth: {default: null, ':focus-visible': 3},
    outlineStyle: {default: null, ':focus-visible': 'solid'},
    outlineColor: {
      default: null,
      ':focus-visible': colorVars['--color-accent'],
    },
    outlineOffset: {default: null, ':focus-visible': 6},
  },
  skipLink: {
    position: 'fixed',
    top: 12,
    left: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colorVars['--color-background-muted'],
    zIndex: 10,
    transform: {
      default: 'translateY(-180%)',
      ':focus': 'translateY(0)',
    },
    color: colorVars['--color-text-primary'],
  },
  brand: {
    display: 'inline-flex',
    gap: 13,
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: {default: 29, '@media (max-width: 700px)': 26},
    letterSpacing: '-0.05em',
    fontWeight: 650,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  brandFooter: {
    width: {default: null, '@media (max-width: 700px)': '100%'},
  },
  brandMark: {
    display: 'block',
    width: 40,
    height: 40,
    objectFit: 'contain',
    flexShrink: 0,
  },
  brandCaption: {
    fontSize: 11,
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: 0,
    width: 48,
    color: colorVars['--color-text-secondary'],
    marginLeft: 3,
    fontFamily: 'system-ui, sans-serif',
    display: {default: null, '@media (max-width: 1000px)': 'none'},
  },
  // In the footer the caption comes back at phone widths, where the
  // brand spans the full row.
  brandCaptionFooter: {
    fontSize: 11,
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: 0,
    width: 48,
    color: colorVars['--color-text-secondary'],
    marginLeft: 3,
    fontFamily: 'system-ui, sans-serif',
    display: {
      default: null,
      '@media (max-width: 1000px)': 'none',
      '@media (max-width: 700px)': 'block',
    },
  },
  topnavLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: {
      default: 32,
      '@media (max-width: 1000px)': 20,
      '@media (max-width: 700px)': 14,
    },
    fontSize: {default: 14, '@media (max-width: 700px)': 12},
  },
  navLink: {
    textDecoration: 'none',
  },
  navExternal: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: {default: 8, '@media (max-width: 700px)': 6},
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colorVars['--color-border'],
    borderRadius: 24,
    paddingTop: {default: 9, '@media (max-width: 700px)': 6},
    paddingBottom: {default: 9, '@media (max-width: 700px)': 6},
    paddingLeft: {default: 18, '@media (max-width: 700px)': 12},
    paddingRight: {default: 18, '@media (max-width: 700px)': 12},
    textDecoration: 'none',
  },
  githubIcon: {
    display: 'block',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    width: 18,
    height: 18,
    fill: 'currentColor',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1.1fr 1fr',
      '@media (max-width: 700px)': 'minmax(0, 1fr)',
    },
    alignItems: 'center',
    paddingTop: {
      default: 58,
      '@media (min-width: 1500px)': 80,
      '@media (max-width: 1000px)': 35,
      '@media (max-width: 700px)': 34,
    },
  },
  // The site's display scale rides on the Astryx headings via xstyle:
  // the theme's display types supply the font and weight, these keep
  // the original site's sizes and tight leading.
  heroTitle: {
    fontSize: 'clamp(3.4rem, 6.2vw, 5.6rem)',
    letterSpacing: '-0.04em',
    lineHeight: 1.04,
  },
  displayTitle: {
    fontSize: 'clamp(2.2rem, 4.1vw, 3.65rem)',
    letterSpacing: '-0.04em',
    lineHeight: 1.08,
  },
  architectureTitle: {
    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
    letterSpacing: '-0.04em',
    lineHeight: 1.08,
  },
  intro: {
    color: colorVars['--color-accent'],
    fontSize: 14,
    marginTop: 0,
    marginBottom: 25,
    marginLeft: 0,
    marginRight: 0,
  },
  sectionNote: {
    color: colorVars['--color-accent'],
    fontSize: 14,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: {default: 25, '@media (max-width: 700px)': 18},
  },
  heroDescription: {
    maxWidth: 440,
    marginTop: 28,
    fontSize: {default: null, '@media (max-width: 700px)': 16},
  },
  heroLede: {
    color: colorVars['--color-text-secondary'],
    fontSize: 18,
    lineHeight: 1.6,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
    gap: {default: 28, '@media (max-width: 700px)': '20px 25px'},
    marginTop: 34,
    flexWrap: {default: null, '@media (max-width: 700px)': 'wrap'},
  },
  // The hero's filled action: the solid coral step with its hover,
  // overriding the primary Button's themed accent.
  heroButton: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    paddingTop: {default: 14, '@media (max-width: 700px)': 13},
    paddingBottom: {default: 14, '@media (max-width: 700px)': 13},
    paddingLeft: {default: 22, '@media (max-width: 700px)': 18},
    paddingRight: {default: 22, '@media (max-width: 700px)': 18},
    borderRadius: 7,
    backgroundColor: {
      default: siteVars.coralSolid,
      ':hover': siteVars.coralSolidHover,
    },
    color: colorVars['--color-on-accent'],
    textDecoration: 'none',
    transition: 'background-color 150ms ease',
  },
  heroButtonArrow: {
    marginLeft: {default: 28, '@media (max-width: 700px)': 18},
  },
  textLink: {
    fontSize: 14,
    fontWeight: 600,
  },
  heroTextLink: {
    display: {default: null, '@media (max-width: 700px)': 'inline-flex'},
    alignItems: {default: null, '@media (max-width: 700px)': 'center'},
    minHeight: {default: null, '@media (max-width: 700px)': 44},
  },
  githubLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cairnArt: {
    overflow: 'hidden',
    minWidth: 0,
    height: {
      default: 475,
      '@media (max-width: 1000px)': 410,
      '@media (max-width: 700px)': 370,
    },
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    isolation: 'isolate',
    maxWidth: {default: null, '@media (max-width: 700px)': 410},
    width: {default: null, '@media (max-width: 700px)': '100%'},
    justifySelf: {default: null, '@media (max-width: 700px)': 'center'},
    marginTop: {default: null, '@media (max-width: 700px)': 25},
  },
  artCaption: {
    position: 'absolute',
    bottom: {default: 1, '@media (max-width: 700px)': 0},
    fontSize: 12,
    color: colorVars['--color-text-secondary'],
  },
  heroFoot: {
    gridColumn: '1 / -1',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: colorVars['--color-border'],
    marginTop: {
      default: 65,
      '@media (min-width: 1500px)': 90,
      '@media (max-width: 700px)': 30,
    },
    paddingTop: 22,
    paddingBottom: 28,
    display: 'flex',
    justifyContent: 'space-between',
    gap: {default: 20, '@media (max-width: 700px)': 8},
    fontSize: {default: 12, '@media (max-width: 700px)': 11},
    color: colorVars['--color-text-secondary'],
    flexWrap: {default: null, '@media (max-width: 700px)': 'wrap'},
  },
  heroFootLink: {
    textDecoration: 'none',
  },
  footArrow: {
    marginLeft: {default: 18, '@media (max-width: 700px)': 8},
  },
  featured: {
    backgroundColor: siteVars.backgroundFeatured,
    color: '#f5f5fb',
    paddingTop: {default: 74, '@media (max-width: 700px)': 50},
    paddingBottom: {default: 74, '@media (max-width: 700px)': 50},
  },
  featuredLayout: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr 1fr',
      '@media (max-width: 700px)': '1fr',
    },
    gap: {
      default: 100,
      '@media (max-width: 1000px)': 45,
      '@media (max-width: 700px)': 36,
    },
    alignItems: 'center',
  },
  featureBody: {
    marginTop: 26,
    marginBottom: 30,
    maxWidth: {default: 390, '@media (max-width: 700px)': '100%'},
  },
  workflowTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: {default: 24, '@media (max-width: 700px)': 18},
    paddingRight: {default: 24, '@media (max-width: 700px)': 18},
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#414a55',
    fontSize: 13,
  },
  workflowTitleEnd: {
    marginLeft: 'auto',
    color: '#b7bfde',
    fontSize: 11,
  },
  statusDot: {
    width: 7,
    height: 7,
    backgroundColor: siteVars.coralSolid,
    borderRadius: '50%',
  },
  pipeline: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: {default: 24, '@media (max-width: 700px)': 18},
    paddingRight: {default: 24, '@media (max-width: 700px)': 18},
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  pipelineItem: {
    display: 'flex',
    alignItems: 'center',
    gap: {default: 22, '@media (max-width: 700px)': 15},
    paddingTop: 19,
    paddingBottom: 19,
  },
  stepNumber: {
    fontSize: 12,
    color: '#bdc7f2',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#667099',
    borderRadius: '50%',
    width: 32,
    height: 32,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  workflowFoot: {
    paddingTop: 13,
    paddingBottom: 13,
    paddingLeft: 24,
    paddingRight: 24,
    backgroundColor: '#20262e',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    fontSize: 11,
    color: '#bdc7e9',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  projectsSection: {
    paddingTop: {default: 100, '@media (max-width: 700px)': 62},
    paddingBottom: {default: 100, '@media (max-width: 700px)': 62},
  },
  sectionHeading: {
    display: {default: 'flex', '@media (max-width: 700px)': 'block'},
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 45,
    marginBottom: {default: 40, '@media (max-width: 700px)': 28},
  },
  filterLabels: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: {default: 10, '@media (max-width: 700px)': 7},
    marginBottom: 30,
  },
  filterChip: {
    cursor: 'pointer',
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: {default: 17, '@media (max-width: 700px)': 11},
    paddingRight: {default: 17, '@media (max-width: 700px)': 11},
    borderRadius: 24,
    fontSize: {default: 13, '@media (max-width: 700px)': 11},
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colorVars['--color-border'],
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-background-muted'],
    },
    color: colorVars['--color-text-primary'],
    fontFamily: 'inherit',
    display: {default: null, '@media (max-width: 700px)': 'inline-flex'},
    alignItems: {default: null, '@media (max-width: 700px)': 'center'},
    minHeight: {default: null, '@media (max-width: 700px)': 44},
    outlineWidth: {default: null, ':focus-visible': 3},
    outlineStyle: {default: null, ':focus-visible': 'solid'},
    outlineColor: {
      default: null,
      ':focus-visible': colorVars['--color-accent'],
    },
    outlineOffset: {default: null, ':focus-visible': 6},
  },
  filterChipActive: {
    backgroundColor: {
      default: siteVars.chipActiveBackground,
      ':hover': siteVars.chipActiveBackground,
    },
    color: '#ffffff',
    borderColor: siteVars.coralSolid,
  },
  chipCount: {
    marginLeft: {default: 12, '@media (max-width: 700px)': 7},
    fontSize: 11,
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      '@media (max-width: 700px)': '1fr',
    },
    gap: {default: '36px 28px', '@media (max-width: 700px)': 24},
  },
  projectVisual: {
    height: 215,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  codeVisual: {
    backgroundColor: '#302b2c',
    gap: 32,
  },
  siteVisual: {
    backgroundColor: '#30353c',
  },
  codePrompt: {
    fontSize: 42,
    letterSpacing: '-0.07em',
    color: '#eed3c8',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  cursor: {
    color: siteVars.coralSolid,
  },
  codeBracket: {
    fontSize: 85,
    fontWeight: 200,
    color: '#b57863',
  },
  miniSite: {
    width: 255,
    backgroundColor: colorVars['--color-background-body'],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#5a626b',
    borderRadius: 5,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 21,
    paddingRight: 21,
    transform: 'rotate(-5deg) translateY(18px)',
    boxShadow: '10px 15px 0 #22272e',
  },
  miniHeader: {
    fontSize: 13,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-border'],
  },
  miniHeaderDots: {
    float: 'right',
    color: '#8991b4',
  },
  miniContent: {
    position: 'relative',
    fontSize: 25,
    lineHeight: 1.15,
    letterSpacing: '-0.05em',
    paddingTop: 23,
    paddingBottom: 23,
    fontFamily: "'Space Grotesk', sans-serif",
  },
  miniLogo: {
    position: 'absolute',
    right: 0,
    top: 29,
    width: 55,
    height: 55,
  },
  projectBody: {
    paddingTop: {default: 26, '@media (max-width: 700px)': 23},
    paddingBottom: {default: 26, '@media (max-width: 700px)': 23},
    paddingLeft: {default: 26, '@media (max-width: 700px)': 23},
    paddingRight: {default: 26, '@media (max-width: 700px)': 23},
  },
  projectHeadingLink: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    color: 'inherit',
  },
  projectCategory: {
    display: 'block',
    fontSize: 11,
    color: colorVars['--color-text-secondary'],
    marginTop: 10,
  },
  projectText: {
    marginTop: 18,
    marginBottom: 22,
    minHeight: {default: 68, '@media (max-width: 700px)': 0},
  },
  projectTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  architectureSection: {
    paddingBottom: {default: 96, '@media (max-width: 700px)': 60},
  },
  architectureFlow: {
    paddingTop: {
      default: 24,
      '@media (max-width: 1000px)': 18,
      '@media (max-width: 700px)': 22,
    },
    paddingBottom: {
      default: 24,
      '@media (max-width: 1000px)': 18,
      '@media (max-width: 700px)': 22,
    },
    paddingLeft: {
      default: 24,
      '@media (max-width: 1000px)': 18,
      '@media (max-width: 700px)': 22,
    },
    paddingRight: {
      default: 24,
      '@media (max-width: 1000px)': 18,
      '@media (max-width: 700px)': 22,
    },
    marginTop: 0,
    marginBottom: 38,
    marginLeft: 0,
    marginRight: 0,
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(6, 1fr)',
      '@media (max-width: 700px)': '1fr',
    },
    gap: {
      default: 24,
      '@media (max-width: 1000px)': 20,
      '@media (max-width: 700px)': 22,
    },
    backgroundColor: colorVars['--color-background-muted'],
    borderRadius: 8,
  },
  flowItem: {
    position: 'relative',
    textAlign: 'center',
    alignContent: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: {
      default: 12,
      '@media (max-width: 1000px)': 11,
      '@media (max-width: 700px)': 13,
    },
    backgroundColor: colorVars['--color-background-body'],
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#444d58',
    borderRadius: 5,
  },
  // The arrow between flow steps, pointing down once the flow stacks.
  flowArrow: {
    '::after': {
      content: {default: '"→"', '@media (max-width: 700px)': '"↓"'},
      position: 'absolute',
      right: {
        default: -20,
        '@media (max-width: 1000px)': -17,
        '@media (max-width: 700px)': 'auto',
      },
      left: {default: null, '@media (max-width: 700px)': '50%'},
      top: {default: '50%', '@media (max-width: 700px)': 'auto'},
      bottom: {default: null, '@media (max-width: 700px)': -22},
      transform: {
        default: 'translateY(-50%)',
        '@media (max-width: 700px)': 'translateX(-50%)',
      },
      color: '#dca18d',
    },
  },
  architectureNotes: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(3, 1fr)',
      '@media (max-width: 700px)': '1fr',
    },
    gap: {default: 44, '@media (max-width: 700px)': 25},
  },
  noteText: {
    marginTop: 14,
  },
  philosophySection: {
    backgroundColor: siteVars.backgroundPhilosophy,
    paddingTop: {default: 80, '@media (max-width: 700px)': 54},
    paddingBottom: {default: 80, '@media (max-width: 700px)': 54},
  },
  philosophyLayout: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr 1fr',
      '@media (max-width: 700px)': '1fr',
    },
    gap: {
      default: 90,
      '@media (max-width: 1000px)': 45,
      '@media (max-width: 700px)': 36,
    },
  },
  philosophyCopy: {
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    alignItems: 'flex-start',
  },
  philosophyEnd: {
    color: colorVars['--color-text-primary'],
    fontWeight: 600,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  siteFooter: {
    paddingTop: {default: 36, '@media (max-width: 700px)': 28},
    paddingBottom: {default: 36, '@media (max-width: 700px)': 28},
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 24,
    flexWrap: {default: null, '@media (max-width: 700px)': 'wrap'},
  },
  footerTopLink: {
    fontSize: 12,
    color: colorVars['--color-text-secondary'],
  },
});

function GitHubIcon() {
  return (
    <svg
      {...stylex.props(styles.githubIcon)}
      width="18"
      height="18"
      viewBox="0 0 19 19"
      aria-hidden="true"
      focusable="false">
      <use href="/icons.svg#github-icon" />
    </svg>
  );
}

function Brand({inFooter = false}: {inFooter?: boolean}) {
  return (
    <a
      {...stylex.props(styles.link, styles.brand, inFooter && styles.brandFooter)}
      href="#home"
      aria-label="Cairn Software home">
      <img
        {...stylex.props(styles.brandMark)}
        src="/cairn-icon.png"
        alt=""
        width="40"
        height="40"
      />
      Cairn
      <span
        {...stylex.props(
          inFooter ? styles.brandCaptionFooter : styles.brandCaption,
        )}>
        Software studio
      </span>
    </a>
  );
}

type ProjectFilter = 'all' | 'ai' | 'creative';

const FILTERS: {id: ProjectFilter; label: string; count: number}[] = [
  {id: 'all', label: 'All projects', count: 2},
  {id: 'ai', label: 'AI & agents', count: 1},
  {id: 'creative', label: 'Art & creative', count: 1},
];

const PIPELINE = [
  {
    step: '01',
    title: 'Discover the workspace',
    body: 'Find the structure. Understand the context.',
  },
  {
    step: '02',
    title: 'Read what matters',
    body: 'Gather the source behind the task.',
  },
  {
    step: '03',
    title: 'Make a focused change',
    body: 'Apply precise edits where they belong.',
  },
  {
    step: '04',
    title: 'Verify with real tools',
    body: 'Run builds, linters, and tests locally.',
  },
];

const ARCHITECTURE_NOTES = [
  {
    title: 'Context before action',
    body: 'Explore the project and read the relevant source before deciding what needs to change.',
  },
  {
    title: 'Precision over guesswork',
    body: 'Keep edits focused on the task, with clear boundaries around the files being changed.',
  },
  {
    title: 'Evidence before done',
    body: "Use the project's builds and tests to check the work. A plausible answer is only a beginning.",
  },
];

function AppShell() {
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const showProject = (category: ProjectFilter) =>
    filter === 'all' || filter === category;

  return (
    <div {...stylex.props(styles.page)}>
      <a {...stylex.props(styles.link, styles.skipLink)} href="#main">
        Skip to content
      </a>
      <TopNav
        startContent={<Brand />}
        endContent={
          <nav {...stylex.props(styles.topnavLinks)} aria-label="Main navigation">
            <a {...stylex.props(styles.link, styles.navLink)} href="#projects">
              Projects
            </a>
            <a {...stylex.props(styles.link, styles.navLink)} href="#architecture">
              How we build
            </a>
            <a {...stylex.props(styles.link, styles.navLink)} href="#philosophy">
              Philosophy
            </a>
            <a
              {...stylex.props(styles.link, styles.navExternal)}
              href="https://github.com/cairn">
              <GitHubIcon />
              GitHub
            </a>
          </nav>
        }
      />
      <main id="main" tabIndex={-1}>
        <section
          {...stylex.props(styles.wrap, styles.hero)}
          aria-labelledby="hero-title">
          <div>
            <p {...stylex.props(styles.intro)}>
              Independent thinking. Independent software.
            </p>
            <Heading level={1} type="display-1" id="hero-title" xstyle={styles.heroTitle}>
              Small stones.
              <br />
              New paths.
            </Heading>
            <div {...stylex.props(styles.heroDescription)}>
              <p {...stylex.props(styles.heroLede)}>
                We build tools that make complex things feel natural.
                Autonomous agents, thoughtful interfaces, and experiments at
                the edges of code.
              </p>
            </div>
            <div {...stylex.props(styles.heroActions)}>
              <Button variant="primary" href="#projects" xstyle={styles.heroButton}>
                Explore our projects{' '}
                <span {...stylex.props(styles.heroButtonArrow)} aria-hidden="true">
                  ↓
                </span>
              </Button>
              <a
                {...stylex.props(styles.link, styles.textLink, styles.heroTextLink)}
                href="#philosophy">
                Meet Cairn
              </a>
            </div>
          </div>
          <div {...stylex.props(styles.cairnArt)}>
            <BrailleCairn />
            <span {...stylex.props(styles.artCaption)}>
              A marker for what comes next.
            </span>
          </div>
          <div {...stylex.props(styles.heroFoot)}>
            <span>Built with curiosity.</span>
            <a {...stylex.props(styles.link, styles.heroFootLink)} href="#cairn-code">
              Discover Cairn{' '}
              <span {...stylex.props(styles.footArrow)} aria-hidden="true">
                ↓
              </span>
            </a>
          </div>
        </section>

        <section
          {...stylex.props(styles.featured)}
          id="cairn-code"
          aria-labelledby="code-title">
          <div {...stylex.props(styles.wrap, styles.featuredLayout)}>
            <div>
              <p {...stylex.props(styles.sectionNote)}>In the workspace</p>
              <Heading
                level={2}
                type="display-2"
                id="code-title"
                xstyle={styles.displayTitle}>
                Less handoff.
                <br />
                More making.
              </Heading>
              <div {...stylex.props(styles.featureBody)}>
                <Text color="secondary">
                  Cairn brings the agent into your development workflow.
                  It explores your project, makes focused edits, and checks
                  the result with your own tools.
                </Text>
              </div>
              <Button
                variant="secondary"
                href="https://github.com/cairn/cairn"
                icon={<GitHubIcon />}
                label="Cairn on GitHub"
                xstyle={styles.focusRing}
              />
            </div>
            <Card padding={0}>
              <div {...stylex.props(styles.workflowTitle)}>
                <span {...stylex.props(styles.statusDot)} aria-hidden="true" />
                Cairn
                <span {...stylex.props(styles.workflowTitleEnd)}>
                  The agent loop
                </span>
              </div>
              <ol {...stylex.props(styles.pipeline)}>
                {PIPELINE.map(item => (
                  <li key={item.step} {...stylex.props(styles.pipelineItem)}>
                    <span {...stylex.props(styles.stepNumber)}>{item.step}</span>
                    <div>
                      <Heading level={3}>{item.title}</Heading>
                      <Text type="supporting">{item.body}</Text>
                    </div>
                  </li>
                ))}
              </ol>
              <p {...stylex.props(styles.workflowFoot)}>
                Context → Action → Verification
              </p>
            </Card>
          </div>
        </section>

        <section
          {...stylex.props(styles.wrap, styles.projectsSection)}
          id="projects"
          aria-labelledby="projects-title">
          <div {...stylex.props(styles.sectionHeading)}>
            <div>
              <p {...stylex.props(styles.sectionNote)}>The collection</p>
              <Heading
                level={2}
                type="display-2"
                id="projects-title"
                xstyle={styles.displayTitle}>
                Different ideas.
                <br />
                Same curiosity.
              </Heading>
            </div>
            <Text color="secondary">
              Practical tools and creative detours.
              <br />
              Explore the things we're building.
            </Text>
          </div>
          <div
            {...stylex.props(styles.filterLabels)}
            role="group"
            aria-label="Filter projects by category">
            {FILTERS.map(item => (
              <button
                key={item.id}
                type="button"
                {...stylex.props(
                  styles.filterChip,
                  filter === item.id && styles.filterChipActive,
                )}
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}>
                {item.label}{' '}
                <span {...stylex.props(styles.chipCount)}>{item.count}</span>
              </button>
            ))}
          </div>
          <div {...stylex.props(styles.projectsGrid)}>
            {showProject('ai') && (
              <Card padding={0}>
                <div
                  {...stylex.props(styles.projectVisual, styles.codeVisual)}
                  aria-hidden="true">
                  <span {...stylex.props(styles.codeBracket)}>[</span>
                  <span {...stylex.props(styles.codePrompt)}>
                    cairn<span {...stylex.props(styles.cursor)}>_</span>
                  </span>
                  <span {...stylex.props(styles.codeBracket)}>]</span>
                </div>
                <div {...stylex.props(styles.projectBody)}>
                  <div>
                    <Heading level={3}>
                      <a
                        {...stylex.props(styles.link, styles.projectHeadingLink)}
                        href="https://github.com/cairn/cairn">
                        Cairn
                        <GitHubIcon />
                      </a>
                    </Heading>
                    <span {...stylex.props(styles.projectCategory)}>
                      Developer tools
                    </span>
                  </div>
                  <div {...stylex.props(styles.projectText)}>
                    <Text color="secondary">
                      An autonomous engineering assistant that works directly
                      in your workspace, from first read to verified change.
                    </Text>
                  </div>
                  <div {...stylex.props(styles.projectTags)}>
                    <Badge label="CLI" />
                    <Badge label="Agents" />
                    <Badge label="Local-first" />
                  </div>
                </div>
              </Card>
            )}
            {showProject('creative') && (
              <Card padding={0}>
                <div
                  {...stylex.props(styles.projectVisual, styles.siteVisual)}
                  aria-hidden="true">
                  <div {...stylex.props(styles.miniSite)}>
                    <div {...stylex.props(styles.miniHeader)}>
                      Cairn{' '}
                      <span {...stylex.props(styles.miniHeaderDots)}>•••</span>
                    </div>
                    <div {...stylex.props(styles.miniContent)}>
                      Small stones.
                      <br />
                      New paths.
                      <img
                        {...stylex.props(styles.miniLogo)}
                        src="/cairn-icon.png"
                        alt=""
                        width="55"
                        height="55"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
                <div {...stylex.props(styles.projectBody)}>
                  <div>
                    <Heading level={3}>
                      <a
                        {...stylex.props(styles.link, styles.projectHeadingLink)}
                        href="https://github.com/cairn/cairn.github.io">
                        Our little corner
                        <GitHubIcon />
                      </a>
                    </Heading>
                    <span {...stylex.props(styles.projectCategory)}>
                      The studio website
                    </span>
                  </div>
                  <div {...stylex.props(styles.projectText)}>
                    <Text color="secondary">
                      A home for our work and the ideas behind it. An
                      intentionally simple site, built on the Astryx design
                      system.
                    </Text>
                  </div>
                  <div {...stylex.props(styles.projectTags)}>
                    <Badge label="Web design" />
                    <Badge label="Astryx" />
                    <Badge label="You're here" />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </section>

        <section
          {...stylex.props(styles.wrap, styles.architectureSection)}
          id="architecture"
          aria-labelledby="architecture-title">
          <div {...stylex.props(styles.sectionHeading)}>
            <div>
              <p {...stylex.props(styles.sectionNote)}>
                From intent to execution
              </p>
              <Heading
                level={2}
                id="architecture-title"
                xstyle={styles.architectureTitle}>
                Grounded in the workspace.
              </Heading>
            </div>
            <Text color="secondary">
              Model reasoning meets the files, commands, and checks that make
              software work.
            </Text>
          </div>
          <ol {...stylex.props(styles.architectureFlow)}>
            <li {...stylex.props(styles.flowItem, styles.flowArrow)}>
              User prompt
            </li>
            <li {...stylex.props(styles.flowItem, styles.flowArrow)}>
              Agent engine
            </li>
            <li {...stylex.props(styles.flowItem, styles.flowArrow)}>
              Filesystem tools
            </li>
            <li {...stylex.props(styles.flowItem, styles.flowArrow)}>
              Focused edits
            </li>
            <li {...stylex.props(styles.flowItem, styles.flowArrow)}>
              Local verification
            </li>
            <li {...stylex.props(styles.flowItem)}>Result</li>
          </ol>
          <div {...stylex.props(styles.architectureNotes)}>
            {ARCHITECTURE_NOTES.map(note => (
              <Card key={note.title} padding={4}>
                <Heading level={3}>{note.title}</Heading>
                <div {...stylex.props(styles.noteText)}>
                  <Text color="secondary">{note.body}</Text>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section
          {...stylex.props(styles.philosophySection)}
          id="philosophy"
          aria-labelledby="philosophy-title">
          <div {...stylex.props(styles.wrap, styles.philosophyLayout)}>
            <div>
              <p {...stylex.props(styles.sectionNote)}>Why Cairn</p>
              <Heading
                level={2}
                type="display-2"
                id="philosophy-title"
                xstyle={styles.displayTitle}>
                A little direction.
                <br />
                A lot of possibility.
              </Heading>
            </div>
            <div {...stylex.props(styles.philosophyCopy)}>
              <Text>
                A cairn is a simple thing: a few stones, carefully placed,
                that help someone find their way. That's how we think about
                software.
              </Text>
              <Text>
                We start with what intelligence makes possible and build
                around the people using it. Sometimes that means an agent
                working alongside you. Sometimes it's a flower and a poem
                that make you pause.
              </Text>
              <p {...stylex.props(styles.philosophyEnd)}>
                Useful by intention. Open to discovery. Care is our moat.
              </p>
              <a
                {...stylex.props(styles.link, styles.textLink, styles.githubLink)}
                href="https://github.com/cairn">
                <GitHubIcon />
                Follow the work on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer {...stylex.props(styles.wrap, styles.siteFooter)}>
        <Brand inFooter />
        <Text type="supporting">© 2026 Cairn Software</Text>
        <a {...stylex.props(styles.link, styles.footerTopLink)} href="#home">
          Back to the top <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <Theme theme={cairnTheme} mode="dark">
      <AppShell />
    </Theme>
  );
}
