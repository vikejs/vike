Example of changing the [Base URL](https://vite-plugin-ssr.com/base-url).

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/base-url/
npm install
npm run dev
# Or
# npm run preview
```

Highlights:
 - [vite.config.js#base](vite.config.js).
 - `<Link>` implementation using `import.meta.env.BASE_URL`: [components/Link.jsx](components/Link.jsx).
 - Referencing static assets: [renderer/_default.page.server.jsx](renderer/_default.page.server.jsx) (see `logoUrl` and `manifestUrl`).

See also:
 - [vite-plugin-ssr.com > Guides > Base URL](https://vite-plugin-ssr.com/base-url)
