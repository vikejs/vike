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
