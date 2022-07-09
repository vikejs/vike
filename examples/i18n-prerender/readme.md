Example of a `vite-plugin-ssr` app that is:
 - Internationalized (i18n)
 - Pre-rendered (SSG)

Note the usage of the `onBeforeRoute()` and `onBeforePrerender()` hooks.

If you don't pre-render your app, then have a look at [/examples/i18n/](/examples/i18n/) instead.

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/i18n-prerender/
npm install
npm run preview
```
