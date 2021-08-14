Example of deploying a Vite + `vite-plugin-ssr` app to [Cloudflare Workers](https://workers.cloudflare.com/).

Note how we load `dist/server/importBuild.js` in [worker/ssr.js](worker/ssr.js).

Also see [vite-plugin-ssr.com/cloudflare-workers](https://vite-plugin-ssr.com/cloudflare-workers).

To run it:

1. ```bash
    git clone git@github.com:brillout/vite-plugin-ssr
    cd vite-plugin-ssr/examples/cloudflare-workers/
    ```

2. Create a Cloudflare account and paste your account id in `wrangler.toml#account_id`.

3. ```bash
   npm install
   ```
   To develop (for increased dev speed we use an Express.js dev server instead of `wrangler`):
   ```bash
   npm run dev
   ```
   To build and try the worker locally:
   ```bash
   npm run prod
   ```
   To build and deploy the worker to Cloudflare Workers:
   ```bash
   npm run deploy
   ```
