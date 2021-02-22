### Routing

By default `vite-plugin-ssr` does Filesystem Routing.

```
Filesystem                  URL
pages/index.page.js         /
pages/about.page.js         /about
pages/faq/index.page.js     /faq
```

For more control, you can define route strings in `.page.route.js` files.

```
// /pages/product.page.route.js

export default '/product/:productId'
```

The `productId` value is available at `contextProps.productId` so that you can fetch data in `async addContextProps({contextProps})` which is explained at [Data Fetching](#data-fetching).

For full programmatic control, you can define route functions.

```js
// pages/admin.page.route.js

// Route functions allow us to implement advanced routing such as route guards.
export default async ({url, contextProps}) => {
  if (url==='/admin' && contextProps.user.isAdmin) {
    return { match: true }
  }
}
```

For detailed informations about Filesystem Routing, route strings, and route functions:
 - [API - Filesystem Routing]()
 - [API - `*.page.route.js`]()
