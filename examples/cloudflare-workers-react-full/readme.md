[Cloudflare Workers](https://workers.cloudflare.com/) with:
 - Vite
 - `vite-plugin-ssr`
 - React
 - [`react-streaming`](https://github.com/brillout/react-streaming)
 - Universal `fetch()`


## Docs

See [vite-plugin-ssr.com/cloudflare-workers](https://vite-plugin-ssr.com/cloudflare-workers).


## Run

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/cloudflare-workers-react-full/
npm install
```

Develop:

> For increased development speed, we use an Express.js development server instead of a worker.

```bash
npm run dev
```

Preview the worker locally:

> You'll need to login/create a Cloudflare account.

```bash
npm run preview
```

Deploy the worker to Cloudflare:
```bash
npm run deploy
```


## Universal `fetch()`

Note how we define a fetch function at `pageContext.fetch` that is universal: it works for development as well as for the production worker.

The trick is to provide a different `fetch()` implementation at [worker/ssr.ts](worker/ssr.ts) and [dev-server/index.js](dev-server/index.js).

## Node.js shim warning

The example sets `wrangler.toml#node_compat` to `true` which makes wrangler show a warning:
```
[WARNING] Enabling node.js compatibility mode for built-ins and globals. This is experimental and has serious tradeoffs.
```
We can safely ignore it (the only Node.js shims used are all robust).

> The Node.js shims add around `200KB`-`300KB` to your worker code, which is significant considering the `1MB` limit. There is work-in-progress to remove the need for Node.js shims, see [#445](https://github.com/brillout/vite-plugin-ssr/issues/445).
