export { addSsrMiddleware }

import { type PageContextInit, renderPageServer } from '../../../server/runtime/renderPageServer.js'
import universalVikeHandler from '../../../server/runtime/universalVikeHandler.js'
import { getAppMiddlewares } from '../../../server/runtime/middlewares.js'
import { createHttpResponseFromUniversalMiddleware } from '../../../server/runtime/renderPageServer/createHttpResponse.js'
import { getAdapterRuntime } from '@universal-middleware/core'
import { createRequestAdapter } from '@universal-middleware/node/request'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import type { ServerResponse } from 'node:http'
import { assertWarning } from '../../../utils/assert.js'
import pc from '@brillout/picocolors'
import '../assertEnvVite.js'
type ConnectServer = ViteDevServer['middlewares']

const requestAdapter = createRequestAdapter()

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
    const pageContextInit: PageContextInit = {
      urlOriginal: url,
      headersOriginal: headers,
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
    let httpResponse: Awaited<ReturnType<typeof renderPageServer>>['httpResponse']
    try {
      // The app has +middleware: they run around Vike's pages, as on any server
      if ((await getAppMiddlewares()).length > 1) {
        const request = requestAdapter(req, res)
        const response = await universalVikeHandler(request, {}, getAdapterRuntime('other', { params: undefined }))
        httpResponse = createHttpResponseFromUniversalMiddleware(response)
      } else {
        // Vike's pages answer directly: a `Response` only takes a status code from 200 to 599 (e.g. not `throw render(666)`)
        httpResponse = (await renderPageServer(pageContextInit)).httpResponse
      }
    } catch (err) {
      // Throwing an error in a connect middleware shuts down the server
      console.error(err)
      // - next(err) automatically uses buildErrorMessage() (pretty formatting of Rollup errors)
      //   - But it only works for users using Vite's standalone dev server (it doesn't work for users using Vite's dev middleware)
      // - We purposely don't use next(err) to align behavior: we use our own/copied implementation of buildErrorMessage() regardless of whether the user uses Vite's dev middleware or Vite's standalone dev server
      return next()
    }

    if (httpResponse.statusCode === 404 && isPreview && isPrerenderingEnabled) {
      // Serve /dist/client/404.html instead
      return next()
    }

    const configHeaders = (isPreview && config?.preview?.headers) || config?.server?.headers
    if (configHeaders) {
      for (const [name, value] of Object.entries(configHeaders)) if (value) res.setHeader(name, value)
    }

    setHeadersWithMultipleCookies(res, httpResponse.headers)
    res.statusCode = httpResponse.statusCode
    httpResponse.pipe(res)
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
