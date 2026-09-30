export { addUniversalMiddlewares }

import type { ViteDevServer } from 'vite'
import { createRequestAdapter } from '@universal-middleware/node/request'
import { sendResponse, setResponseHeaders } from '@universal-middleware/node/response'
import { universalMiddlewares } from '../../../server/runtime/getUniversalMiddlewares.js'
import '../assertEnvVite.js'
type ConnectServer = ViteDevServer['middlewares']

const requestAdapter = createRequestAdapter()

function addUniversalMiddlewares(middlewares: ConnectServer) {
  middlewares.use(async (req, res, next) => {
    if (res.headersSent) return next()
    let response: Response | undefined
    try {
      response = await universalMiddlewares(requestAdapter(req, res))
    } catch (err) {
      // Throwing an error in a connect middleware shuts down the server
      console.error(err)
      return next()
    }
    if (!response) return next()
    setResponseHeaders(response, res)
    await sendResponse(response, res)
  })
}
