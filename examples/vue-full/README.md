Example of manually integrating Vue that showcases many features.

> [!NOTE]
> For creating a new Vike app, we recommend using [Bati](https://batijs.dev) instead of copying this example. Because this example uses a custom Vue integration instead of using `vike-vue` which [we generally don't recommend](https://vike.dev/new/core).

For a simpler example, check out [/examples/vue-minimal/](/examples/vue-minimal/).

Features:
 - Client Routing (+ usage of `navigate()`)
 - Data Fetching (server-side fetching + isomorphic fetching)
 - Pre-rendering (+ usage of the `onBeforePrerenderStart()` hook)
 - Route Function
 - TypeScript
 - Markdown
 - Error Page
 - Active Links
 - Access `pageContext` from any Vue component
 - HTML streaming

```bash
git clone git@github.com:vikejs/vike
cd vike/examples/vue-full/
npm install
npm run dev
```
