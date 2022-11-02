[Cloudflare Workers](https://workers.cloudflare.com/) with:
 - Vite
 - `vite-plugin-ssr`
 - Vue
 - HTML streaming


## Docs

See [vite-plugin-ssr.com/cloudflare-workers](https://vite-plugin-ssr.com/cloudflare-workers).


## Run

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/cloudflare-workers-vue/
npm install
```

Develop:

> For increased development speed, we use Vite's development server instead of a worker.

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

## Node.js shim warning

The example sets `wrangler.toml#node_compat` to `true` which makes wrangler show a warning:
```
[WARNING] Enabling node.js compatibility mode for built-ins and globals. This is experimental and has serious tradeoffs.
```
But we can safely ignore the warning (the only Node.js shims used are all robust). However, the Node.js shims add around `200KB`-`300KB` to your worker code, which is significant considering the `1MB` limit. There is work-in-progress to remove the need for Node.js shims, see [#445](https://github.com/brillout/vite-plugin-ssr/issues/445).
