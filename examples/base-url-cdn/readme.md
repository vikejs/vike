Example of deploying static assets to a CDN.

To run it:

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/base-url-cdn/
npm install # (do not use yarn, as yarn installs the entire monorepo)
npm run dev
```

Highlights:
 - Static Assets in the HTML returned by the `render()` hook: [renderer/_default.page.server.jsx](renderer/_default.page.server.jsx).
 - Setting the `baseAssets` config of [createPageRenderer](server/ssr.js).
 - Setting the `base` config of [vite.config.js](vite.config.js).
