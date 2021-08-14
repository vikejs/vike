Example of defining import path aliases with `vite-plugin-ssr`.

We use:
 - Vite's `vite.config.js#resolve.alias` for Vite processed files (i.e. `**/*.page.*` files and their imports).
 - TypeScript's `tsconfig#compilerOptions.paths` for TypeScript's IntelliSense.
 - The npm module [`module-alias`](https://github.com/ilearnio/module-alias) and its `package.json#_moduleAliases` config for the server entry.

This means we define the alias `~` three times: at `vite.config.js`, `tsconfig.json` and `package.json`.

If we don't use TypeScript we can simply skip defining `tsconfig#compilerOptions.paths`.

If we don't plan to use path aliases for our server entry we can skip using `module-alias` and therefore skip defining `package.json#_moduleAliases`.

Examples:
 - [pages/index.page.tsx](pages/index.page.tsx)
 - [server/index.ts](server/index.ts)

To run the example:

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/path-aliases/
npm install
npm run dev
```
