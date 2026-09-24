# Cairn Software

The [Cairn Software website](https://cairn.github.io): an independent software studio's project collection, agent workflow, and philosophy.

## Design

The site uses semantic HTML and responsive CSS, with a dark-only charcoal and coral palette, the official Cairn logo, and CSS project illustrations. Space Grotesk is self-hosted under the SIL Open Font License in `public/fonts/`, with a preloaded variable font and system fallbacks. GitHub links use the existing SVG icon sprite. Project categories use native radio controls and CSS filtering. Navigation, keyboard focus, reduced-motion preferences, and mobile layouts work without browser JavaScript.

- `index.html`: content, navigation, project links, and category controls.
- `src/style.css`: layout, illustrations, responsive styles, and filtering.
- `public/`: static assets, including the supplied Cairn avatar for the hero and social preview, and the rounded icon for navigation and the favicon.

Legacy TypeScript demonstration modules remain in `src/` but are not imported by the page. No JavaScript is shipped by the production page. The existing Vite/TypeScript build tooling remains in place.

## Development

With the existing dependencies installed:

```sh
bun run dev
bun run build
bun run preview
```

The build runs the existing TypeScript checks and generates the static site in `dist/`. GitHub Actions publishes that directory to GitHub Pages on pushes to `main`.

## Verification

The logo and back-to-top links use `#home` to return to the page top, including navigation. The skip link uses `#main` and focuses the main content. Section links target `#cairn-code`, `#projects`, `#architecture`, and `#philosophy`.

Check desktop and mobile widths, keyboard navigation and visible focus, all three project filters, and section links. The public catalog contains three projects: one in AI & agents and two in Art & creative. Verify that `dist/index.html` has no script tags and that the output contains no JavaScript bundles.
