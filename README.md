# Cairn Software

The [Cairn Software website](https://cairn.github.io): an independent software studio's project collection, agent workflow, and philosophy.

## Design

The site is pure static HTML and CSS. No JavaScript is shipped, no build step exists, and no dependencies are installed. It uses semantic HTML and responsive CSS, with a dark-only charcoal and coral palette, the official Cairn logo, and CSS project illustrations. Space Grotesk is self-hosted under the SIL Open Font License in `public/fonts/`, with a preloaded variable font and system fallbacks. GitHub links use the existing SVG icon sprite. Project categories use native radio controls and CSS filtering. Navigation, keyboard focus, reduced-motion preferences, and mobile layouts work without browser JavaScript.

- `index.html`: content, navigation, project links, and category controls.
- `style.css`: layout, illustrations, responsive styles, and filtering.
- `public/`: static assets, including the supplied Cairn avatar for the hero and social preview, and the rounded icon for navigation and the favicon.

## Development

There is nothing to install. To preview locally, serve the directory with any static file server:

```sh
python3 -m http.server 8000
```

GitHub Actions publishes `index.html`, `style.css`, and `public/` to GitHub Pages on pushes to `main` (see `.github/workflows/deploy.yml`).

## Verification

The logo and back-to-top links use `#home` to return to the page top, including navigation. The skip link uses `#main` and focuses the main content. Section links target `#cairn-code`, `#projects`, `#architecture`, and `#philosophy`.

Check desktop and mobile widths, keyboard navigation and visible focus, all three project filters, and section links. The public catalog contains three projects: one in AI & agents and two in Art & creative. Verify that `index.html` contains no script tags.
