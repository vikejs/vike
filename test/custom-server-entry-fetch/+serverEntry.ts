// https://vike.dev/serverEntry
// There isn't any +server.js => `$ vike dev` runs this file as well
// A fetch handler like with Bun.serve() and Deno.serve(), served by Node.js's http server

import assert from 'node:assert'
import { createServer } from 'node:http'
import { getGlobalContext } from 'vike'
import { createDevMiddleware, renderPage } from 'vike/server'
import { fetchNodeHandler } from 'srvx/node'
import type { NodeHTTP1Middleware, NodeHttpHandler } from 'srvx'

const globalContext = await getGlobalContext()
assert(!globalContext.isClientSide)
const { devMiddleware } = globalContext
// This test app only runs in development (test-dev.test.ts)
assert(devMiddleware)

const fetchHandler = async (request: Request): Promise<Response> => {
  if (new URL(request.url).pathname === '/dev-middleware-is-vite') {
    const { viteServer } = await createDevMiddleware()
    return new Response(String(devMiddleware === viteServer.middlewares))
  }
  // Vite's development middleware, through srvx's emulation of Node.js's req/res
  let handled = true
  const handler: NodeHTTP1Middleware = (req, res, next) =>
    devMiddleware(req, res, () => {
      handled = false
      next()
    })
  // fetchNodeHandler() also accepts a middleware (a handler with `next`), but srvx's type doesn't say so
  const response = await fetchNodeHandler(handler as NodeHttpHandler, request)
  if (handled) return response
  const { httpResponse } = await renderPage({ urlOriginal: request.url, headersOriginal: request.headers })
  return new Response(httpResponse.getReadableWebStream(), {
    status: httpResponse.statusCode,
    headers: httpResponse.headers,
  })
}

// Node.js's req/res => Request/Response, like Bun.serve() and Deno.serve()
const server = createServer(async (req, res) => {
  const request = new Request(`http://${req.headers.host}${req.url}`, {
    method: req.method,
    headers: req.headers as Record<string, string>,
  })
  const response = await fetchHandler(request)
  res.writeHead(response.status, Object.fromEntries(response.headers))
  res.end(Buffer.from(await response.arrayBuffer()))
})
const port = process.env.PORT || 3000
server.listen(port, () => console.log(`Server running at http://localhost:${port}`))
