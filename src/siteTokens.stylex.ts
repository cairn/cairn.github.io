/**
 * Site-specific StyleX tokens for cairn.github.io.
 *
 * The shared palette (surfaces, text, borders, the coral accent) comes
 * from the Cairn theme's Astryx tokens in CairnTheme.ts. These vars hold
 * the few colours that are unique to this site's own surfaces and
 * illustrations and have no equivalent in the shared theme: the two
 * section washes, the solid coral used for filled actions, and the
 * active filter chip fill.
 */
import * as stylex from '@stylexjs/stylex';

export const siteVars = stylex.defineVars({
  // The featured section's wash, one step lighter than the body slate.
  backgroundFeatured: '#1d232b',
  // The philosophy section's wash.
  backgroundPhilosophy: '#222930',
  // The solid coral for filled actions (the brand's darker coral step,
  // used on the hero button, the status dot, and the terminal cursor).
  coralSolid: '#d97757',
  coralSolidHover: '#e58a6b',
  // The active filter chip's deep coral fill.
  chipActiveBackground: '#693e32',
});
