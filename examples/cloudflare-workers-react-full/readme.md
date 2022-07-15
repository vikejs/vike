[Cloudflare Workers](https://workers.cloudflare.com/) with:
 - Vite
 - `vite-plugin-ssr`
 - React
 - [`react-streaming`](https://github.com/brillout/react-streaming)
 - Universal `fetch()`


## Docs

See [vite-plugin-ssr.com/cloudflare-workers](https://vite-plugin-ssr.com/cloudflare-workers).


## Run

Setup:
```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/cloudflare-workers-react-full/
npm install
```

To develop: (For increased development speed, we use an Express.js development server instead of a worker.)
```bash
npm run dev
```

To preview the worker locally:
```bash
npm run preview
```

> You'll need to login/create a Cloudflare account.

To deploy the worker to Cloudflare:
```bash
npm run deploy
```


## Universal `fetch()`

Note how we define a fetch function at `pageContext.fetch` that works in development as well as in the production worker.

The trick is to provide a different `fetch()` implementation at [worker/ssr.js](worker/ssr.js) and [dev-server/index.js](dev-server/index.js).
