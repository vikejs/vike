export let logError = prodLogError
export { isNewError }
export let logInfo: null | LoggerInfo = null

export { prodLogError }
export type { LogErrorArgs }
export { logError_set }
export { logInfo_set }

import type { LogInfoArgs } from '../../plugin/shared/logWithVite'
import { isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import { assert, assertWarning, getGlobalObject, hasProp, isObject, isSameErrorMessage } from '../utils'
import { getGlobalContext } from '../globalContext'
import pc from '@brillout/picocolors'

const globalObject = getGlobalObject('runtime/renderPage/logger.ts', {
  wasAlreadyLogged: new WeakSet<object>()
})

type LoggerError = (...args: LogErrorArgs) => boolean
type LoggerInfo = (...args: LogInfoArgs) => void
type LogErrorArgs = [
  unknown,
  {
    // httpRequestId is null upon pre-rendering
    httpRequestId: number | null
    canBeViteUserLand: boolean
  }
]

function logError_set(logger: LoggerError) {
  logError = logger
}
function logInfo_set(logger: LoggerInfo) {
  logInfo = logger
}

function prodLogError(...[err, { canBeViteUserLand }]: LogErrorArgs): boolean {
  warnIfObjectIsNotObject(err)
  setAlreadyLogged(err)

  if (isRenderErrorPageException(err)) {
    assert(canBeViteUserLand)
    return false
  }

  if (canBeViteUserLand) {
    /* Not needed anymore?
    // Avoid logging error twice (not sure if this actually ever happens?)
    if (hasAlreadyLogged(err)) {
      return
    }
    */
    const { viteDevServer } = getGlobalContext()
    if (viteDevServer) {
      /* We purposely don't use hasErrorLogged():
         - We don't trust Vite with such details
           - Previously, Vite bug lead to swallowing of errors: https://github.com/vitejs/vite/issues/12631
         - We do the inverse: we swallow superfluous Vite errors logs instead
      if (viteDevServer.config.logger.hasErrorLogged(err as Error)) {
        return
      }
      */
      if (hasProp(err, 'stack')) {
        // Apply source maps
        viteDevServer.ssrFixStacktrace(err as Error)
      }
    }
  }

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)
  console.error(pc.red(errStr))
  return true
}

function isNewError(errErrorPage: unknown, errFirstAttempt: unknown): boolean {
  warnIfObjectIsNotObject(errErrorPage)
  return !isSameErrorMessage(errFirstAttempt, errErrorPage) || !hasAlreadyLogged(errFirstAttempt)
}

function hasAlreadyLogged(err: unknown): boolean {
  if (!isObject(err)) return false
  return globalObject.wasAlreadyLogged.has(err)
}
function setAlreadyLogged(err: unknown): void {
  if (!isObject(err)) return
  globalObject.wasAlreadyLogged.add(err)
}

function warnIfObjectIsNotObject(err: unknown): void {
  if (!isObject(err)) {
    console.warn('[vite-plugin-ssr] The thrown value is:')
    console.warn(err)
    assertWarning(
      false,
      "Your source code threw a value that is not an object. Make sure to wrap the value with `new Error()`. For example, if your code throws `throw 'some-string'` then do `throw new Error('some-string')` instead. The thrown value is printed above. Feel free to contact vite-plugin-ssr maintainers to get help.",
      { showStackTrace: false, onlyOnce: false }
    )
  }
}
