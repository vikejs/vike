Example of building a renderer for `vite-plugin-ssr`.

To run it:

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/renderer/app/
pnpm install # https://pnpm.io/
pnpm run dev
```

Note that `renderer` doesn't need any build step and can be published to npm as-is.

> It's not the most common but still a conventional practice to publish source files such as `.ts` or `.vue` to npm (e.g. SvelteKit and Hydrogen ship source files to npm.) The trick here is that `vite-plugin-ssr` adds the `renderer`'s `.page.js` files to Vite's crawl paths.
