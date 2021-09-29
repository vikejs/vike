Example of deploying app to [Cloudflare Workers](https://workers.cloudflare.com/) with Vite + `vite-plugin-ssr` + React.

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

To link with the `vite-plugin-ssr` source code:

1. Link the `vite-plugin-ssr` source code:
   ```
   cd ../../vite-plugin-ssr/ # Go to the root directory of the `vite-plugin-ssr` source code
   yarn build # Build the `vite-plugin-ssr` source code
   yarn link
   cd examples/cloudflare-workers-vue-html-streaming/
   yarn link vite-plugin-ssr
   ```

2. Uncomment the `postinstall` script in `package.json`, to ensure that Wrangler doesn't break the `yarn link`.
