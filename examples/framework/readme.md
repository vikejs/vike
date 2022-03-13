Example of building a framework on top of `vite-plugin-ssr`.

To run it:

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/framework/
pnpm install # https://pnpm.io/
cd app/
pnpm run dev
```

Note that `framework` doesn't need any build step and can be published to npm as-is.

> It's not the most common but still a conventional practice to publish source files such as `.ts` or `.vue` to npm (e.g. SvelteKit and Hydrogen also ship source files to npm.) The trick here is that `vite-plugin-ssr` adds the `framework`'s `.page.js` files to Vite's crawl paths.
