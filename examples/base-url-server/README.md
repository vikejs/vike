Example of deploying static assets to a CDN + setting a Base URL for the server.

> [!NOTE]
> For creating a new Vike app, we recommend using [Bati](https://batijs.dev) instead of copying this example. Because this example uses a custom React integration instead of using `vike-react` which [we generally don't recommend](https://vike.dev/new/core).

```bash
git clone git@github.com:vikejs/vike
cd vike/examples/base-url-server/
npm install
npm run start
```

Highlights:
 - Setting the `baseAssets` and `baseServer` Vike config: [vite.config.js](vite.config.js).
 - HTML referencing assets deployed to a CDN using `import.meta.env.BASE_ASSETS`: [renderer/+onRenderHtml.jsx](renderer/+onRenderHtml.jsx).
 - `<Link>` implementation using `import.meta.env.BASE_SERVER`: [components/Link.jsx](components/Link.jsx).
