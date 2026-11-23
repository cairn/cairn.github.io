# Cairn Software

The [Cairn Software website](https://cairn.github.io): an independent software studio building a terminal-based coding agent.

## Design

The site is a single static page: `index.html` at the repository root, with no build step and no framework. It carries the Cairn palette (dark slate, coral accent) and Space Grotesk, and its hero is the Cairn mark as an animated canvas: nine dot spheres stacked 1, 3, 5, shaded against a fixed light, turning very slowly (one revolution a minute), locked to the vertical axis, draggable to spin up to a capped top speed. Visitors who prefer reduced motion get the still front pose.

- `index.html`: the whole page, styles and script inline.
- `public/`: static brand assets (avatar, icon, banners), served unchanged.

## Publishing

GitHub Actions assembles `dist/` from `index.html` and `public/` and publishes it to GitHub Pages on pushes to `main` (see `.github/workflows/deploy.yml`). To preview, serve the repository root with any static file server.
