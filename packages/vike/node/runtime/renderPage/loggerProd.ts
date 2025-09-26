// Logger used for the production server.
// Any other environment (dev, preview, build, and pre-rendering) uses loggerNotProd.ts instead.

export { logErrorProd }
export { onRuntimeError }

import { isAbortError } from '../../../shared/route/abort.js'
import { setAlreadyLogged } from './isNewError.js'
import { warnIfErrorIsNotObject } from '../utils.js'
import { logErrorHint } from './logErrorHint.js'
import { logErrorServer } from '../logErrorServer.js'

function logErrorProd(err: unknown, _httpRequestId: null | number): void {
  warnIfErrorIsNotObject(err)
  setAlreadyLogged(err)

  if (isAbortError(err)) {
    return
  }

  logErrorServer(err)

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
