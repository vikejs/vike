import '../../assertEnvServer.js'

// Logger used for the production server.
// Any other environment (dev, preview, build, and pre-rendering) uses loggerDev.ts instead.

export { loggRuntimeErrorProd }

import { logErrorServer } from '../logErrorServer.js'
import { assertPageContext_logRuntime, type PageContext_logRuntime } from '../loggerRuntime.js'

function loggRuntimeErrorProd(err: unknown, pageContext: PageContext_logRuntime): void {
  assertPageContext_logRuntime(pageContext)
  logErrorServer(err, pageContext)
}
