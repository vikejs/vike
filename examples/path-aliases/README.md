Example of defining import path aliases for Vike apps.

> [!NOTE]
> For creating a new Vike app, we recommend using [Bati](https://batijs.dev) instead of copying this example. Because this example uses a custom React integration instead of using `vike-react` which [we generally don't recommend](https://vike.dev/new/core).

We use:
 - [`vite.config.js#resolve.alias`](https://vitejs.dev/config/#resolve-alias) for files processed by Vite.
   (All `+` files and their imports)
 - [`package.json#imports`](https://nodejs.org/api/packages.html#subpath-patterns) for Node.js files not processed by Vite.
 - [`tsconfig.json#compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths) for TypeScript.

This means we may need to define the alias `#root` at up to three different places.

If we don't use TypeScript, we can skip defining `tsconfig.json#compilerOptions.paths`.

If we don't plan to use path aliases for Node.js server code, we can skip defining `package.json#imports`.

Path alias usage examples:
 - [pages/index/+Page.tsx](pages/index/+Page.tsx)
 - [server/index.ts](server/index.ts)

To run the example:

```bash
git clone git@github.com:vikejs/vike
cd vike/examples/path-aliases/
npm install
npm run dev
```
