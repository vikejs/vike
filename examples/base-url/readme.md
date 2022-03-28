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
 - HTML referencing assets deployed to a CDN: [renderer/_default.page.server.jsx](renderer/_default.page.server.jsx).
 - Setting the `base` config: [vite.config.js](vite.config.js).

It showcases:
 - Changing the Base URL in production:
    - With SSR: `npm run prod:ssr`.
    - With [pre-rendering](https://vite-plugin-ssr.com/pre-rendering): `npm run prod:ssg`.
 - Changing the Base URL in dev?
    - Yes: `npm run dev:base-url`
    - No: `npm run dev`.

See also:
 - [vite-plugin-ssr.com > Guides > Base URL](https://vite-plugin-ssr.com/base-url)
