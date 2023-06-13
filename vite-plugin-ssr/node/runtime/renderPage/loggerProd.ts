// Logger used for the production server.
// Any other environement (dev, preview, build, and pre-rendering) uses loggerNotProd.ts instead.

export { logErrorProd }

import { isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import { isObject, warnIfObjectIsNotObject } from '../utils'
import pc from '@brillout/picocolors'
import { setAlreadyLogged } from './isNewError'
import type { HttpRequestId } from '../../plugin/shared/loggerNotProd'

function logErrorProd(err: unknown, _httpRquestId: HttpRequestId): boolean {
  warnIfObjectIsNotObject(err)
  setAlreadyLogged(err)

  if (isRenderErrorPageException(err)) {
    return false
  }

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)
  console.error(pc.red(errStr))
  return true
}
