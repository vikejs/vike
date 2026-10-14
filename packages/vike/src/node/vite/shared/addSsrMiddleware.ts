export { addSsrMiddleware }

import { vikeUniversalMiddleware } from '../../../server/runtime/universal-middleware/vikeUniversalMiddleware.js'
import { getAdapterRuntime } from '@universal-middleware/core'
import { createRequestAdapter } from '@universal-middleware/node/request'
import { sendResponse } from '@universal-middleware/node/response'
import type { ResolvedConfig, ViteDevServer } from 'vite'
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
    let response: Response
    try {
      const runtime = Object.assign(getAdapterRuntime('other', { params: undefined }), { req, res })
      const context = { urlOriginal: url }
      response = await vikeUniversalMiddleware(requestAdapter(req, res), context, runtime)
    } catch (err) {
      // Throwing an error in a connect middleware shuts down the server
      console.error(err)
      // - next(err) automatically uses buildErrorMessage() (pretty formatting of Rollup errors)
      //   - But it only works for users using Vite's standalone dev server (it doesn't work for users using Vite's dev middleware)
      // - We purposely don't use next(err) to align behavior: we use our own/copied implementation of buildErrorMessage() regardless of whether the user uses Vite's dev middleware or Vite's standalone dev server
      return next()
    }

    if (response.status === 404 && isPreview && isPrerenderingEnabled) {
      // Serve /dist/client/404.html instead
      return next()
    }

    const configHeaders = (isPreview && config?.preview?.headers) || config?.server?.headers
    if (configHeaders) {
      for (const [name, value] of Object.entries(configHeaders)) if (value) res.setHeader(name, value)
    }

    await sendResponse(response, res)
  })
}
