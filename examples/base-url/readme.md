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
 - Setting the `base` config in [vite.config.js](vite.config.js) as well as in [createPageRenderer](server/server.js).

It showcases:
 - Changing the Base URL in production. With [pre-rendering](https://vite-plugin-ssr.com/pre-rendering) (`npm run prod:ssg`) or SSR (`npm run prod:ssr`).
 - Changing the Base URL in dev (`npm run dev:base-url`) or not (`npm run dev`).

See also:
 - [vite-plugin-ssr.com > Guides > Base URL](https://vite-plugin-ssr.com/base-url)
