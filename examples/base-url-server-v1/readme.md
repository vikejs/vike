Example of deploying static assets to a CDN + setting a Base URL for the server.

```bash
git clone git@github.com:vikejs/vike
cd vike/examples/base-url-server/
npm install
npm run start
```

Highlights:
 - Setting the `baseAssets` and `baseServer` Vike config: [vite.config.js](vite.config.js).
 - HTML referencing assets deployed to a CDN using `import.meta.env.BASE_ASSETS`: [renderer/_default.page.server.jsx](renderer/_default.page.server.jsx).
 - `<Link>` implementation using `import.meta.env.BASE_SERVER`: [components/Link.jsx](components/Link.jsx).
