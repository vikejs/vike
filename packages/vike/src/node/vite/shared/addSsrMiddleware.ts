export { addSsrMiddleware }
export { addPlusMiddleware }

import { type PageContextInitInternal, renderPageServer } from '../../../server/runtime/renderPageServer.js'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { assertWarning } from '../../../utils/assert.js'
import pc from '@brillout/picocolors'
import { getAdapterRuntime, type ExpressAdapter } from '@universal-middleware/core'
import { createRequestAdapter } from '@universal-middleware/node/request'
import { sendResponse } from '@universal-middleware/node/response'
import { runUniversalMiddlewares } from '../../../server/runtime/getUniversalMiddlewares.js'
import { setPlusMiddlewareInstalled } from '../../../server/runtime/assertPlusMiddlewareInstalled.js'
import '../assertEnvVite.js'
type ConnectServer = ViteDevServer['middlewares']

const requestAdapter = createRequestAdapter()
// Context and response handlers returned by +middleware, applied by addSsrMiddleware()
const contexts = new WeakMap<IncomingMessage, Universal.Context>()
const responseHandlers = new WeakMap<IncomingMessage, (response: Response) => Promise<Response>>()

function addPlusMiddleware(middlewares: ConnectServer) {
  // The +middleware can call renderPage()
  setPlusMiddlewareInstalled()
  middlewares.use(async (req, res, next) => {
    try {
      // What Universal Middleware's Express adapter passes: Vite's server is a Connect server
      const express = Object.freeze({ req, res }) as unknown as ExpressAdapter['express']
      const runtime = getAdapterRuntime('express', { params: undefined, ...express, express })
      const context: Universal.Context = {}
      const result = await runUniversalMiddlewares(requestAdapter(req, res), context, runtime)
      if (result instanceof Response) return sendResponse(result, res)
      if (typeof result === 'function') responseHandlers.set(req, result)
      else Object.assign(context, result)
      contexts.set(req, context)
    } catch (err) {
      // Not thrown (that shuts down the server), and not next() (that renders the page)
      return next(err)
    }
    next()
  })
}

function addSsrMiddleware(
  middlewares: ConnectServer,
  config: ResolvedConfig,
  isPreview: boolean,
  isPrerenderingEnabled: boolean | null,
) {
  middlewares.use(async (req, res, next) => {
    if (res.headersSent) return next()
    const url = req.originalUrl || req.url
    if (!url) return next()
    const { headers } = req
    const pageContextInit: PageContextInitInternal = {
      ...contexts.get(req),
      urlOriginal: url,
      headersOriginal: headers,
      _nodeDev: { req, res },
    }
    Object.defineProperty(pageContextInit, 'userAgent', {
      get() {
        // TO-DO/next-major-release: assertUsage() instead of assertWarning()
        assertWarning(
          false,
          `${pc.cyan('pageContext.userAgent')} is deprecated: use ${pc.cyan(
            "pageContext.headers['user-agent']",
          )} instead.`,
          {
            showStackTrace: true,
            onlyOnce: true,
          },
        )
        return headers['user-agent']
      },
      enumerable: false,
    })
    try {
      const pageContext = await renderPageServer(pageContextInit)

      if (pageContext.httpResponse.statusCode === 404 && isPreview && isPrerenderingEnabled) {
        // Serve /dist/client/404.html instead
        return next()
      }

      const configHeaders = (isPreview && config?.preview?.headers) || config?.server?.headers
      if (configHeaders) {
        for (const [name, value] of Object.entries(configHeaders)) if (value) res.setHeader(name, value)
      }

      const { httpResponse } = pageContext
      const applyResponseHandlers = responseHandlers.get(req)
      if (applyResponseHandlers) {
        const { statusCode: status, headers } = httpResponse
        return sendResponse(
          await applyResponseHandlers(new Response(httpResponse.getReadableWebStream(), { status, headers })),
          res,
        )
      }
      setHeadersWithMultipleCookies(res, httpResponse.headers)
      res.statusCode = httpResponse.statusCode
      httpResponse.pipe(res)
    } catch (err) {
      // Throwing an error in a connect middleware shuts down the server
      console.error(err)
      // - next(err) automatically uses buildErrorMessage() (pretty formatting of Rollup errors)
      //   - But it only works for users using Vite's standalone dev server (it doesn't work for users using Vite's dev middleware)
      // - We purposely don't use next(err) to align behavior: we use our own/copied implementation of buildErrorMessage() regardless of whether the user uses Vite's dev middleware or Vite's standalone dev server
      return next()
    }
  })
}

// A response can have several Set-Cookie headers: res.setHeader() would only keep the last one
function setHeadersWithMultipleCookies(res: ServerResponse, headers: [string, string][]) {
  const cookies: string[] = []
  headers.forEach(([name, value]) => {
    if (name.toLowerCase() === 'set-cookie') cookies.push(value)
    else res.setHeader(name, value)
  })
  if (cookies.length > 0) res.setHeader('set-cookie', cookies)
}
