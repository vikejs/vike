Example of using `vite-plugin-ssr` with [Solid](https://www.solidjs.com/).

> This example re-renders the whole page upon page navigation (because Solid doesn't do VDOM diffing) which may lead to slightly performance degradation. PR welcome to improve this example.

To run it:

```bash
git clone git@github.com:brillout/vite-plugin-ssr
cd vite-plugin-ssr/examples/solid/
npm install
npm run dev
```
