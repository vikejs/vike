// Logger used for the production server.
// Any other environement (dev, preview, build, and pre-rendering) uses loggerNotProd.ts instead.

export { logErrorProd }

import { isRenderAbort } from '../../../shared/route/RenderAbort'
import { setAlreadyLogged } from './isNewError'
import { isObject, warnIfObjectIsNotObject } from '../utils'
import pc from '@brillout/picocolors'

function logErrorProd(err: unknown, _httpRquestId: null | number): void {
  warnIfObjectIsNotObject(err)
  setAlreadyLogged(err)

  if (isRenderAbort(err)) {
    return
  }

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)
  console.error(pc.red(errStr))
}
