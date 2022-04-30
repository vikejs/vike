Example of deploying to [Cloudflare Workers](https://workers.cloudflare.com/) with:
 - Vite
 - `vite-plugin-ssr`
 - React
 - [`react-streaming`](https://github.com/brillout/react-streaming)


## Docs

See [vite-plugin-ssr.com/cloudflare-workers](https://vite-plugin-ssr.com/cloudflare-workers).


## Run example

Setup:
```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/cloudflare-workers/
npm install
```

To develop: (For increased development speed, we use an Express.js development server instead of a worker.)
```bash
npm run dev
```

To try the worker locally with miniflare: (No account needed.)
```bash
npm run preview
```

To try the worker locally with wrangler:
```bash
npm run preview:wrangler
```

> To be able to use `wrangler`, you'll need to create a Cloudflare account and paste your account id in `wrangler.toml#account_id`.

To deploy the worker to Cloudflare:
```bash
npm run deploy
```


## Universal `fetch()`

Note how we define a fetch function at `pageContext.fetch` which works in both the development Node.js server as well as in the production worker.

The trick is to add a different `fetch()` implementation to `pageContextInit` at [worker/ssr.js](worker/ssr.js) and [dev-server/index.js](dev-server/index.js).
