export { addSsrMiddleware }

import { renderPage } from '../../runtime/renderPage.js'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import { assertWarning } from '../utils.js'
import pc from '@brillout/picocolors'
type ConnectServer = ViteDevServer['middlewares']

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
    const pageContextInit = {
      urlOriginal: url,
      headersOriginal: headers,
    }
    Object.defineProperty(pageContextInit, 'userAgent', {
      get() {
        // TO-DO/next-major-release assertUsage() instead of assertWarning()
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
    let pageContext: Awaited<ReturnType<typeof renderPage>>
    try {
      pageContext = await renderPage(pageContextInit)
    } catch (err) {
      // Throwing an error in a connect middleware shut downs the server
      console.error(err)
      // - next(err) automatically uses buildErrorMessage() (pretty formatting of Rollup errors)
      //   - But it only works for users using Vite's standalone dev server (it doesn't work for users using Vite's dev middleware)
      // - We purposely don't use next(err) to align behavior: we use our own/copied implementation of buildErrorMessage() regardless of whether the user uses Vite's dev middleware or Vite's standalone dev server
      return next()
    }

    if (pageContext.httpResponse.statusCode === 404 && isPreview && isPrerenderingEnabled) {
      // Serve /dist/client/404.html instead
      return next()
    }

    const configHeaders = (isPreview && config?.preview?.headers) || config?.server?.headers
    if (configHeaders) {
      for (const [name, value] of Object.entries(configHeaders)) if (value) res.setHeader(name, value)
    }

    const { httpResponse } = pageContext
    httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value))
    res.statusCode = httpResponse.statusCode
    httpResponse.pipe(res)
  })
}
