// Logger used for the production server.
// Any other environement (dev, preview, build, and pre-rendering) uses loggerNotProd.ts instead.

export { logErrorProd }

import { isAbortError } from '../../../shared/route/abort.js'
import { setAlreadyLogged } from './isNewError.js'
import { isObject, warnIfObjectIsNotObject } from '../utils.js'
import pc from '@brillout/picocolors'

function logErrorProd(err: unknown, _httpRquestId: null | number): void {
  warnIfObjectIsNotObject(err)
  setAlreadyLogged(err)

  if (isAbortError(err)) {
    return
  }

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)
  console.error(pc.red(errStr))
}
