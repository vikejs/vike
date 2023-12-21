> [!NOTE]
> This example is deprecated. See [`cloudflare-workers-vue-v1`](../cloudflare-workers-vue-v1/) instead.

[Cloudflare Workers](https://workers.cloudflare.com/) with:
 - Vite
 - Vike
 - Vue
 - HTML streaming


## Docs

See [vike.dev/cloudflare-workers](https://vike.dev/cloudflare-workers).


## Run

```bash
git clone git@github.com:vikejs/vike
cd vike/examples/cloudflare-workers-vue/
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
