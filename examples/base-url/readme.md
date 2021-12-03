Example of changing the [Base URL](https://vite-plugin-ssr.com/base-url).

To run it:

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/base-url/
npm install
npm run dev
```

Highlights:
 - `<Link>` implementation using `import.meta.env.BASE_URL`: [components/Link.jsx](components/Link.jsx).
 - Static Assets in the HTML returned by the `render()` hook: [renderer/_default.page.server.jsx](renderer/_default.page.server.jsx).
 - Setting the `base` config in [vite.config.js]() as well as in [createPageRenderer](/server/index.js).

It showcases:
 - Both using ([`package.json#scripts.dev:with-base-url`](package.json)) and skipping ([`package.json#scripts.dev:without-base-url`](package.json)) the Base URL in development.
 - Productionn Node.js server ([`package.json#scripts.prod:server`](package.json)) and static server ([`package.json#scripts.prod:static`](package.json)) (aka SSG / pre-rendering).

See also:
 - [vite-plugin-ssr.com > Guides > Base URL](https://vite-plugin-ssr.com/base-url)
