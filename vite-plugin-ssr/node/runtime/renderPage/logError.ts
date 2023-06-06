export { logErrorWithVite }
export { logErrorWithoutVite }
export { isNewError }

import { assertRenderErrorPageExceptionUsage, isRenderErrorPageException } from '../../../shared/route/RenderErrorPage'
import { assert, assertWarning, hasProp, isObject, isSameErrorMessage } from '../utils'
import { getGlobalContext } from '../globalContext'
import { isTranspileError, logTranspileError } from '../shared/logTranspileError'

/** Log errors that don't originate from code transpiled by Vite. I.e. errors that aren't thrown from user code. */
function logErrorWithoutVite(err: unknown) {
  assertError(err)
  assert(!isRenderErrorPageException(err))
  consoleError(err)
}

/** Handles errors that may originate from code transpiled by Vite. I.e. errors that are thrown from user code. */
function logErrorWithVite(err: unknown): void {
  assertError(err)

  if (isRenderErrorPageException(err)) {
    return
  }

  // Avoid logging error twice (not sure if this actually ever happens?)
  if (hasAlreadyLogged(err)) {
    return
  }
  setAlreadyLogged(err)

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

  consoleError(err)
}

function consoleError(err: unknown) {
  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  const errStr = (hasProp(err, 'stack') && String(err.stack)) || String(err)
  console.error(errStr)
}

function isNewError(errErrorPage: unknown, errFirstAttempt: unknown): boolean {
  assertError(errErrorPage)
  return !isSameErrorMessage(errFirstAttempt, errErrorPage) || !hasAlreadyLogged(errFirstAttempt)
}

function hasAlreadyLogged(err: unknown) {
  if (!isObject(err)) return false
  const key = '_wasAlreadyConsoleLogged'
  return err[key] === true
}
function setAlreadyLogged(err: unknown) {
  if (!isObject(err)) return
  const key = '_wasAlreadyConsoleLogged'
  err[key] = true
}

function assertError(err: unknown): void {
  assertRenderErrorPageExceptionUsage(err)
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
