Example of deploying to [Cloudflare Workers](https://workers.cloudflare.com/) with:
 - Vite
 - `vite-plugin-ssr`
 - Vue
 - HTML streaming


## Docs

See [vite-plugin-ssr.com/cloudflare-workers](https://vite-plugin-ssr.com/cloudflare-workers).


## Run example

Setup:
```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/cloudflare-workers-vue-html-streaming/
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

To be able to use `wrangler`, create a Cloudflare account and paste your account id in `wrangler.toml#account_id`.

To try the worker locally with wrangler:
```bash
npm run preview:wrangler
```

To deploy the worker to Cloudflare:
```bash
npm run deploy
```


## `dist/server/importBuild.js`

Note how we load [`dist/server/importBuild.js`](https://vite-plugin-ssr.com/importBuild.js) in [worker/ssr.js](worker/ssr.js).
