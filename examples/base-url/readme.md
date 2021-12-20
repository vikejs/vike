Example of changing the [Base URL](https://vite-plugin-ssr.com/base-url).

To run it:

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/base-url/
npm install # (do not use yarn, as yarn installs the entire monorepo)
npm run dev
```

Highlights:
 - `<Link>` implementation using `import.meta.env.BASE_URL`: [components/Link.jsx](components/Link.jsx).
 - Static Assets in the HTML returned by the `render()` hook: [renderer/_default.page.server.jsx](renderer/_default.page.server.jsx).
 - Setting the `base` config in [vite.config.js](vite.config.js) as well as in [createPageRenderer](server/server.js).

It showcases:
 - Changing the Base URL in production. Without [pre-rendering](https://vite-plugin-ssr.com/pre-rendering) ([`package.json#scripts.prod:server`](package.json)) or with pre-rendering ([`package.json#scripts.prod:static`](package.json)).
 - Also changing the Base URL in dev ([`package.json#scripts.dev:with-base-url`](package.json)) or not ([`package.json#scripts.dev:without-base-url`](package.json)).

See also:
 - [vite-plugin-ssr.com > Guides > Base URL](https://vite-plugin-ssr.com/base-url)
