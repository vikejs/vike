<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[<img src="https://vike.dev/vike-readme.svg" align="right" height="90">](https://vike.dev)
[![npm version](https://img.shields.io/npm/v/vike-node)](https://www.npmjs.com/package/vike-node)

# `vike-node`

Node integration for Vike.

With this extension, your server-side code is transpiled with Vite.<br>
In development, the server process is restarted when a change is detected in some of your server files.

[Installation](#installation)  
[Standalone build](#standalone-build)  
[External packages](#external-packages)  
[Caching and compression](#caching-and-compression)  
[Custom pageContext](#custom-pagecontext)  
[Framework examples](#framework-examples)  
[Migration guide](#migration-guide)

<br/>

## Installation

1. `npm install vike-node express`
2. Extend `vite.config.js`:

   ```js
   // vite.config.js

   import vikeNode from 'vike-node/plugin'

   export default {
     // ...
     plugins: [vikeNode('server/index.js')]
   }
   ```

3. Create `server/index.js`:

   ```js
   // server/index.js

   import express from 'express'
   import vike from 'vike-node/connect'

   startServer()

   function startServer() {
     const app = express()
     app.use(vike())
     const port = process.env.PORT || 3000
     app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
   }
   ```

## Standalone build:

You can enable standalone builds by setting `standalone` to `true`.
<br>
After build, the output `dist` folder will contain everything for a deployment.
<br>
With standalone mode, the production environment only needs the `dist` folder to be present.
<br>
Example start script: `NODE_ENV=production node dist/server/index.mjs`

```js
// vite.config.js

import vikeNode from 'vike-node/plugin'

export default {
  // ...
  plugins: [
    vikeNode({
      entry: 'server/index.js',
      standalone: true
    })
  ]
}
```

## External packages:

Packages that import native binaries/custom assets need to be added to `external`.<br>
When building with `standalone` enabled, `external` packages and their assets are copied to the output `dist` directory.<br>
By default, the `external` setting includes:

- `sharp`
- `@prisma/client`
- `@node-rs/*`

```js
// vite.config.js

import vikeNode from 'vike-node/plugin'

export default {
  // ...
  plugins: [
    vikeNode({
      entry: 'server/index.js',
      standalone: true,
      external: ['my-rust-package']
    })
  ]
}
```

## Caching and compression:

In production, `vike-node`:

- compresses all Vike responses
- caches the compressed static assets(.js, .css).

On a request, if the asset(.js, .css) is not in the cache, `vike-node` compresses it with a fast compression level, sends it in the response, then recompresses it with a high compression level and finally caches the compressed data.<br>
You can disable compression/caching:

```js
app.use(
  vike({
    compress: false,
    static: {
      cache: false
    }
  })
)
```

## Custom [pageContext](https://vike.dev/pageContext):

You can define custom [pageContext](https://vike.dev/pageContext) properties:

```js
app.use(
  vike({
    pageContext: (req) => ({
      user: req.user
    })
  })
)
```

## Framework examples:

`vike-node` includes middlewares for the most popular web frameworks:

- Express
- Fastify
- Hono

Express:

```js
// server/index.js

import express from 'express'
import vike from 'vike-node/connect'

startServer()

function startServer() {
  const app = express()
  app.use(vike())
  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
}
```

Fastify:

```js
// server/index.js

import fastify from 'fastify'
import vike from 'vike-node/fastify'

startServer()

function startServer() {
  const app = fastify()
  app.register(vike())
  const port = process.env.PORT || 3000
  app.listen({ port: +port }, () => console.log(`Server running at http://localhost:${port}`))
}
```

Hono:

```js
// server/index.js

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import vike from 'vike-node/hono'

startServer()

function startServer() {
  const app = new Hono()
  app.use(vike())
  const port = +(process.env.PORT || 3000)
  serve(
    {
      fetch: app.fetch,
      port
    },
    () => console.log(`Server running at http://localhost:${port}`)
  )
}
```

## Migration guide:

```diff
// server/index.js

- import { renderPage } from 'vike/server'
+ import { vike } from 'vike-node/connect'

- if (isProduction) {
-   app.use(express.static(`${root}/dist/client`))
- } else {
-   const vite = await import('vite')
-   const viteDevMiddleware = (
-     await vite.createServer({
-       root,
-       server: { middlewareMode: true }
-     })
-   ).middlewares
-   app.use(viteDevMiddleware)
- }

- app.get('*', async (req, res, next) => {
-   const pageContextInit = {
-     urlOriginal: req.originalUrl
-   }
-   const pageContext = await renderPage(pageContextInit)
-   const { httpResponse } = pageContext
-   if (!httpResponse) {
-     return next()
-   } else {
-     const { statusCode, headers } = httpResponse
-     headers.forEach(([name, value]) => res.setHeader(name, value))
-     res.status(statusCode)
-     httpResponse.pipe(res)
-   }
- })

+ app.use(vike())

```

```diff
// package.json

"scripts": {
- "dev": "node ./server",
+ "dev": "vite",
}
```
