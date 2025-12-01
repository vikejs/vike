// Logger used for the production server.
// Any other environment (dev, preview, build, and pre-rendering) uses loggerDev.ts instead.

export { loggRuntimeErrorProd }

import { setAlreadyLogged } from './isNewError.js'
import { logErrorServer } from '../logErrorServer.js'
import { assertPageContext_logRuntime, type PageContext_logRuntime } from '../loggerRuntime.js'

function loggRuntimeErrorProd(err: unknown, pageContext: PageContext_logRuntime): void {
  assertPageContext_logRuntime(pageContext)

  setAlreadyLogged(err)

  logErrorServer(err, pageContext)
}
