export let logError = prodLogError
export { isNewError }

export { prodLogError }

export let logRuntimeMsg: Logger | null = null
export { logRuntimeMsg_set }
export type { LogErrArgs }

import type { LogArgs } from '../../plugin/shared/devLogger'
import { assertRenderErrorPageExceptionUsage, isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import { assert, assertWarning, getGlobalObject, hasProp, isObject, isSameErrorMessage } from '../utils'
import { getGlobalContext } from '../globalContext'
import { isTranspileError, logTranspileError } from '../shared/logTranspileError'
import pc from '@brillout/picocolors'

const globalObject = getGlobalObject('runtime/renderPage/logger.ts', {
  wasAlreadyLogged: new WeakSet<object>()
})

type Logger = (...args: LogArgs) => void
type LogErrArgs = [unknown, { requestId: number | null; canBeViteUserLand: boolean }]

function logRuntimeMsg_set(logger: Logger) {
  logRuntimeMsg = logger
}

function prodLogError(...[err, { requestId, canBeViteUserLand }]: LogErrArgs) {
  warnIfObjectIsNotObject(err)
  setAlreadyLogged(err)

  if (!canBeViteUserLand) {
    assert(!isRenderErrorPageException(err))
  } else {
    assertRenderErrorPageExceptionUsage(err)

    if (isRenderErrorPageException(err)) {
      return
    }

    /* Not needed anymore?
    // Avoid logging error twice (not sure if this actually ever happens?)
    if (hasAlreadyLogged(err)) {
      return
    }
    */

    const { viteDevServer } = getGlobalContext()
    if (viteDevServer) {
      /* Temporary disable: https://github.com/vitejs/vite/issues/12631
    if (viteDevServer.config.logger.hasErrorLogged(err as Error)) {
      return
    }
    */
      if (hasProp(err, 'stack')) {
        // Apply source maps
        viteDevServer.ssrFixStacktrace(err as Error)
      }
      if (isTranspileError(err)) {
        // We handle transpile errors globally in logError() because transpile errors can be thrown not only when calling viteDevServer.ssrLoadModule() but also later when calling user hooks (since Vite loads/transpiles user code in a lazy manner)
        logTranspileError(viteDevServer, err)
        return
      }
    }
  }

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)
  console.error(pc.red(errStr))
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
