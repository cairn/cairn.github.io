# Cairn Software

The [Cairn Software website](https://cairn.github.io): an independent software studio's project collection, agent workflow, and philosophy.

## Design

The site is a small Vite + React app built on Meta's Astryx design system, using the same Cairn theme as the cairn-gui web preview: the dark-only slate and coral palette, the official Cairn logo, and CSS project illustrations. Space Grotesk is self-hosted under the SIL Open Font License in `public/fonts/`, with a preloaded variable font and system fallbacks. GitHub links use the existing SVG icon sprite. Project categories are filtered with React state. The build output is a static site; GitHub Pages serves `dist/`.

- `index.html`: page head and metadata; the app mounts into `#root`.
- `src/App.tsx`: content, navigation, project links, and category filtering, composed from Astryx components (TopNav, Heading, Text, Button, Card, Badge) under the Cairn theme.
- `src/CairnTheme.ts`: the Cairn theme for Astryx, generated from this site's palette.
- `src/site.css`: the Astryx reset plus page layout, illustrations, and responsive styles.
- `public/`: static assets, including the supplied Cairn avatar for the hero and social preview, and the rounded icon for navigation and the favicon. Vite copies `public/` into `dist/` unchanged.

## Development

Install dependencies once, then run the dev server or build:

```sh
bun install
bun run dev      # local preview
bun run build    # production build into dist/
```

GitHub Actions builds the site and publishes `dist/` to GitHub Pages on pushes to `main` (see `.github/workflows/deploy.yml`).

## Verification

The logo and back-to-top links use `#home` to return to the page top, including navigation. The skip link uses `#main` and focuses the main content. Section links target `#cairn-code`, `#projects`, `#architecture`, and `#philosophy`.

Check desktop and mobile widths, keyboard navigation and visible focus, all three project filters, and section links. The public catalog contains two projects: one in AI & agents and one in Art & creative.
