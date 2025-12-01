// Logger used for the production server.
// Any other environment (dev, preview, build, and pre-rendering) uses loggerDev.ts instead.

export { loggRuntimeErrorProd }
export { onRuntimeError }

import { isAbortError } from '../../../shared-server-client/route/abort.js'
import { setAlreadyLogged } from './isNewError.js'
import { logErrorHint } from './logErrorHint.js'
import { logErrorServer } from '../logErrorServer.js'
import { assertPageContext_logRuntime, type PageContext_logRuntime } from '../loggerRuntime.js'

function loggRuntimeErrorProd(err: unknown, pageContext: PageContext_logRuntime): void {
  assertPageContext_logRuntime(pageContext)

  setAlreadyLogged(err)

  if (isAbortError(err)) {
    return
  }

  logErrorServer(err, pageContext)

  // Needs to be called after logging the error.
  onRuntimeError(err)
}

// Every server-side runtime error is expected to go through `onRuntimeError()`.
//  - onRuntimeError(err) should always be called after `console.error(err)`.
//    - Because the error hint of logErrorHint(err) should be shown *after* the error.
//  - In principle, any runtime error is (or at least should) be caught by Vike, otherwise Vike couldn't render the error page.
function onRuntimeError(err: unknown) {
  // The more runtime errors we pass to logErrorHint() the better.
  logErrorHint(err)
}
