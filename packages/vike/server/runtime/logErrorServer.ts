export { logErrorServer }

import pc from '@brillout/picocolors'
import { assertIsNotBrowser, assertWarning, hasRed, isDebugError, isObject } from '../utils.js'
import { execHookOnError } from './renderPageServer/execHookOnError.js'
import { assertPageContext_logRuntime, type PageContext_logRuntime } from './loggerRuntime.js'
import { logErrorHint } from './renderPageServer/logErrorHint.js'
assertIsNotBrowser()

// TODO implement +onHook(err, pageContext)
function logErrorServer(err: unknown, pageContext: PageContext_logRuntime) {
  assertPageContext_logRuntime(pageContext)

  warnIfErrorIsNotObject(err)

  execHookOnError(err)

  const errPrinted = getStackOrMessage(isDebugError() ? getOriginalErrorDeep(err) : err)
  console.error(hasRed(errPrinted) ? errPrinted : pc.red(errPrinted))

  // The more runtime errors we pass to logErrorHint() the better.
  logErrorHint(err)
}

function getOriginalErrorDeep(err: any): unknown {
  if (!isObject(err) || !err.getOriginalError) return err
  // getOriginalError() is set by getBetterError()
  // https://github.com/vikejs/vike/blob/c0dc090e64ca9daa516ebf884fef66f5531cae69/packages/vike/utils/getBetterError.ts#L32
  return getOriginalErrorDeep((err as any).getOriginalError())
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
