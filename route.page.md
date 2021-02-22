## API - `*.route.page.js`

The `*.route.page.*` files enable full control over the routing.

**Route strings**

For a page `/pages/film.page.js`, its route string can be defined at its `/pages/film.page.route.js` adjacent file.

```js
// /pages/film.page.route.js

// Match URLs `/film/1`, `/film/2`, ...
export default '/film/:filmId'
```

If the URL matches, the value of `filmId` is available at `contextProps.filmId`.

The syntax of route strings is based on [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)
(the most widespread syntax in the JavaScript ecosystem).
For user friendlier docs, check out the [Express.js Routing Docs](https://expressjs.com/en/guide/routing.html)
(Express uses `path-to-regexp` as well).

**Route functions**

Route functions give you full programmatic flexibility to define your routing logic.

```js
// /pages/film/admin.page.route.js

export default route

async function route(url, contextProps) {
  if (! contextProps.user.isAdmin) {
    return {match: false}
  }
  if (! /\/film\/[0-9]+\/admin/.test(url)) {
    return {match: false}
  }
  filmId = url.split('/')[2]
  return {
    match: true,
    // Add additional context props
    contextProps: { filmId }
  }
}
```

The `match` value can be a (negative) number which allows for resolving route conflicts.
For example, `vite-plugin-ssr` internally defines `_404.page.js`'s route as:

```js
// node_modules/vite-plugin-ssr/.../_404.page.route.js

// Ensure lowest priority for the 404 page
export default () => ({match: -Infinity})
```
