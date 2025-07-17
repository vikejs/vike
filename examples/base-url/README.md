Example of changing the [Base URL](https://vike.dev/base-url).

> [!NOTE]
> For creating a new Vike app, we recommend using [Bati](https://batijs.dev) instead of copying this example. Because this example uses a custom React integration instead of using `vike-react` which [we generally don't recommend](https://vike.dev/new/core).

```bash
git clone git@github.com:vikejs/vike
cd vike/examples/base-url/
npm install
npm run dev
# Or
# npm run preview
```

Highlights:
 - [vite.config.js#base](vite.config.js).
 - `<Link>` implementation using `import.meta.env.BASE_URL`: [components/Link.jsx](components/Link.jsx).
 - Referencing static assets: [renderer/+onRenderHtml.jsx](renderer/+onRenderHtml.jsx) (see `logoUrl` and `manifestUrl`).

See also:
 - [vike.dev > Guides > Base URL](https://vike.dev/base-url)
