Example of manually integrating React that showcases many features.

> [!NOTE]
> For creating a new Vike app, we recommend using [Bati](https://batijs.dev) instead of copying this example. Because this example uses a custom React integration instead of using `vike-react` which [we generally don't recommend](https://vike.dev/new/core).

For a simpler example, check out [/examples/react-minimal/](/examples/react-minimal/) instead.

Features:
 - Client Routing (+ usage of `navigate()`)
 - Data Fetching (server-side fetching + isomorphic fetching)
 - Pre-rendering (+ usage of the `onBeforePrerenderStart()` hook)
 - Route Function
 - TypeScript
 - Markdown
 - [`+client.js`](https://vike.dev/client)
 - Error Page
 - Active Links
 - Access `pageContext` from any React component (using React Context)
 - HTML streaming
 - Page Transition Loading Animation

```bash
git clone git@github.com:vikejs/vike
cd vike/examples/react-full/
npm install
npm run dev
```
