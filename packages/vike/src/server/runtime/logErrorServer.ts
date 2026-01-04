export { logErrorServer }
export { hasAlreadyLogged }

import pc from '@brillout/picocolors'
import { assertIsNotBrowser, assertWarning, getGlobalObject, hasRed, isDebugError, isObject } from '../utils.js'
import { execHookOnError } from './renderPageServer/execHookOnError.js'
import { addErrorHint } from './renderPageServer/addErrorHint.js'
import { isAbortError } from '../../shared-server-client/route/abort.js'
import type {
  PageContextCreatedServer,
  PageContextCreatedWithoutGlobalContext,
} from './renderPageServer/createPageContextServer.js'
assertIsNotBrowser()
const globalObject = getGlobalObject('server/runtime/logErrorServer.ts', {
  wasAlreadyLogged: new WeakSet<object>(),
})

function logErrorServer(
  err: unknown,
  pageContext: null | PageContextCreatedServer | PageContextCreatedWithoutGlobalContext,
) {
  if (isAbortError(err) && !isDebugError()) return

  // I don't think there is a use case for printing the same error object twice? Reloading page throwing error => the same error is printed a second time but it's a different error object.
  if (hasAlreadyLogged(err)) return

  warnIfErrorIsNotObject(err)

  const errBetter = addErrorHint(err)

  execHookOnError(errBetter, pageContext)

  const errPrinted = getStackOrMessage(isDebugError() ? getOriginalError(errBetter) : errBetter)
  console.error(hasRed(errPrinted) ? errPrinted : pc.red(errPrinted))

  setAlreadyLogged(err)
}

function getOriginalError(err: any): unknown {
  // getOriginalError() is set by getBetterError()
  // https://github.com/vikejs/vike/blob/c0dc090e64ca9daa516ebf884fef66f5531cae69/packages/vike/utils/getBetterError.ts#L32
  return err?.getOriginalError?.() ?? err
}

// We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
// - TO-DO/eventually: is that still true? Let's eventually remove it and see if it crashes Cloudflare.
function getStackOrMessage(err: any): string {
  if (!isObject(err) || !err.stack) return String(err)
  if (err.hideStack) return err.message as string
  return err.stack as string
}

// It would be cleaner to:
//  - Call assertUsageErrorIsObject() right after calling the user's hook
//    - Attach the original error: assertUsageError.originalErrorValue = err
//      - Show the original error in Vike's error handling
//  - Use assertErrorIsObject() throughout Vike's source code
function warnIfErrorIsNotObject(err: unknown): void {
  if (!isObject(err)) {
    console.warn('[vike] The thrown value is:')
    console.warn(err)
    assertWarning(
      false,
      `One of your hooks threw an error ${pc.cyan('throw someValue')} but ${pc.cyan(
        'someValue',
      )} isn't an object (it's ${pc.cyan(
        `typeof someValue === ${typeof err}`,
      )} instead). Make sure thrown values are always wrapped with ${pc.cyan('new Error()')}, in other words: ${pc.cyan(
        'throw someValue',
      )} should be replaced with ${pc.cyan('throw new Error(someValue)')}. The thrown value is printed above.`,
      { onlyOnce: false },
    )
  }
}

function hasAlreadyLogged(err: unknown): boolean {
  if (!isObject(err)) return false
  return globalObject.wasAlreadyLogged.has(err)
}
function setAlreadyLogged(err: unknown): void {
  if (!isObject(err)) return
  globalObject.wasAlreadyLogged.add(err)
}
