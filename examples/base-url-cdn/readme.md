Example of deploying static assets to a CDN.

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/base-url-cdn/
npm install
npm run start
```

Highlights:
 - Setting the `base` config: [vite.config.js](vite.config.js).
 - HTML referencing assets deployed to a CDN: [renderer/_default.page.server.jsx](renderer/_default.page.server.jsx).
