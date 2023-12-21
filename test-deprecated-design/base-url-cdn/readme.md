> [!NOTE]
> This example is deprecated. See [`base-url-cdn-v1`](../base-url-cdn-v1/) instead.

Example of deploying static assets to a CDN.

```bash
git clone git@github.com:vikejs/vike
cd vike/examples/base-url-cdn/
npm install
npm run start
```

Highlights:
 - Setting the `baseAssets` Vike config: [vite.config.js](vite.config.js).
 - HTML referencing assets deployed to a CDN using `import.meta.env.BASE_ASSETS`: [renderer/_default.page.server.jsx](renderer/_default.page.server.jsx).
