# Stay Dripped Mobile IV Website

This repository contains the static assets and HTML used to power the Stay Dripped Mobile IV marketing website. All UI sections are split into reusable components inside the `components` directory and loaded dynamically with JavaScript. Styles and scripts live under `assets/`.

## Local Development

1. Serve the repository with any static web server, e.g. `npx serve` or `python3 -m http.server`.
2. Open `index.html` in your browser. Components are loaded on page load via JavaScript fetch calls.
3. Edit files inside `components/` to update shared sections like the header, footer, or booking widgets.

## Additional Pages

Standalone pages such as `privacy-policy.html`, `terms-of-service.html`, and `memberships.html` reuse the same header and footer components for consistency.

## Assets

Image and font assets are stored under `assets/`. Placeholder images are included by default; replace them with production imagery for deployment.

## Images

The repository no longer stores local image files. Components reference remote placeholders from [placehold.co](https://placehold.co). Replace these URLs with your own assets when customizing the site.

### Styling

Main styles live in `assets/css/style.css` with additional responsive rules in
`assets/css/responsive.css` and animation helpers in `assets/css/animations.css`.
