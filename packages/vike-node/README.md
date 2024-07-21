<!-- WARNING: keep links absolute in this file so they work on NPM too -->

[<img src="https://vike.dev/vike-readme.svg" align="right" height="90">](https://vike.dev)
[![npm version](https://img.shields.io/npm/v/vike-node)](https://www.npmjs.com/package/vike-node)

# `vike-node`

Node integration for Vike.

Using this extension, your server-side code is transpiled using Vite.<br>
In development, the server process is restarted when a change is detected in some of your server files.

[Installation](#installation)  
[Basic usage](#basic-usage)  
[Standalone build](#standalone-build)  
[Minimal examples](#minimal-examples)  

<br/>


## Installation

1. `npm install vike-node`
2. Extend `vite.config.js`:
   ```js
   // vite.config.js

   import vikeNode from 'vike-node/plugin'

   export default {
     // ...
     plugins: [vikeNode({ entry: "./server/index.js" })]
   }
   ```
3. Change `server/index.js`:
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
4. Change `package.json`:
   ```diff
   // package.json

   "scripts": {
   - "dev": "node ./server",
   + "dev": "vike dev",
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
            entry: './server/index.js',
            standalone: true
        })
    ]
}
```


## Minimal examples:

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

