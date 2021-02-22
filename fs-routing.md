### API - Filesystem routing

By default a page is mapped to a URL based on where its `.page.js` file is located on your filesystem.

```
Filesystem                    URL         Comment
pages/about.page.js           /about
pages/index/index.page.js     /           (`index` is mapped to the empty string)
pages/HELLO.page.js           /hello      (Mapping is done lower case)
```

The `pages/` directory is optional and you can save your `*.page.jsx` files wherever you want.

```
Filesystem                  URL
user/list.page.js           /user/list
user/create.page.js         /user/create
todo/list.page.js           /todo/list
todo/create.page.js         /todo/create
```

The directory common to all your `*.page.js` files is considered the root.

For more control over routing, use route strings and route functions.
 - [Routing](#routing)
 - [API - `*.page.route.js`]()
