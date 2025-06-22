# Stay Dripped Mobile IV Website

This repository contains the static assets and HTML used to power the Stay Dripped Mobile IV marketing website. All UI sections are split into reusable components inside the `components` directory and loaded dynamically with JavaScript. Styles and scripts live under `assets/`.

## Local Development

1. Install Node dependencies with `npm install`. This provides a local web server and CSS linting.
2. Start a development server with `npm run start` and open `http://localhost:3000` in your browser.
3. Run `npm run lint` to check CSS files with Stylelint.
4. Edit files inside `components/` to update shared sections like the header, footer, or booking widgets.

## Additional Pages

Standalone pages such as `privacy-policy.html`, `terms-of-service.html`, and `memberships.html` reuse the same header and footer components for consistency.

## Assets

Image and font assets are stored under `assets/`. Placeholder images are included by default; replace them with production imagery for deployment.
