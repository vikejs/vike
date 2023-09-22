[Cloudflare Workers](https://workers.cloudflare.com/) with:
 - Vite
 - Vike
 - React
 - [`react-streaming`](https://github.com/brillout/react-streaming)
 - Universal `fetch()`


## Docs

See [vike.dev/cloudflare-workers](https://vike.dev/cloudflare-workers).


## Run

```bash
git clone git@github.com:vikejs/vike
cd vike/examples/cloudflare-workers-react-full/
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
