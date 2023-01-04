export { logError }
export { logErrorIfDifferentFromOriginal }
export { assertError }

import { viteAlreadyLoggedError, viteErrorCleanup } from './viteLogging'
import { assertRenderErrorPageExceptionUsage } from './RenderErrorPage'
import { assertWarning, hasProp, isObject, isSameErrorMessage } from '../utils'

function logError(err: unknown): void {
  assertError(err)

  if (viteAlreadyLoggedError(err)) {
    return
  }

  // Avoid logging error twice (not sure if this actually ever happens?)
  if (hasAlreadyLogged(err)) {
    return
  }

  viteErrorCleanup(err)

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  const errStr = (hasProp(err, 'stack') && String(err.stack)) || String(err)
  console.error(errStr)
  setAlreadyLogged(err)
}

function logErrorIfDifferentFromOriginal(err: unknown, errOriginal: unknown): void {
  assertError(err)
  if (!isSameErrorMessage(errOriginal, err) || !hasAlreadyLogged(errOriginal)) {
    logError(err)
  }
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
