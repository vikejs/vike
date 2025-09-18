export { logErrorServer }

import pc from '@brillout/picocolors'
import { isCallable, isObject, getGlobalObject } from './utils.js'
import { getGlobalContextServerInternalOptional } from './globalContext.js'
import { getHookFromPageConfigGlobalCumulative } from '../../shared/hooks/getHook.js'

// Track which errors have already had their onError hook executed
const globalObject = getGlobalObject('runtime/logErrorServer.ts', {
  onErrorHookExecuted: new WeakSet<object>(),
})

function logErrorServer(err: unknown) {
  if (
    isObject(err) &&
    // Set by react-streaming
    // https://github.com/brillout/react-streaming/blob/0f93e09059a5936a1fb581bc1ce0bce473e0d5e0/src/server/renderToStream/common.ts#L36
    isCallable(err.prettifyThisError)
  ) {
    err = err.prettifyThisError(err)
  }

  // We ensure we print a string; Cloudflare Workers doesn't seem to properly stringify `Error` objects.
  // - TO-DO/eventuually: is that still true? Let's eventually remove it and see if it crashes Cloudflare.
  const errStr = isObject(err) && 'stack' in err ? String(err.stack) : String(err)

  console.error(pc.red(errStr))

  // Try to execute +onError hook for all server-side errors
  // This covers errors that occur before global context is initialized
  tryExecOnErrorHook(err)
}

function tryExecOnErrorHook(err: unknown) {
  try {
    // Skip if not an object (can't track in WeakSet)
    if (!isObject(err)) return

    // Skip if onError hook was already executed for this error
    if (globalObject.onErrorHookExecuted.has(err)) return

    // Mark as executed to prevent duplicates
    globalObject.onErrorHookExecuted.add(err)

    // Check if global context is available synchronously
    const globalContextResult = getGlobalContextServerInternalOptional()

    if (!globalContextResult) {
      // Global context not available yet - this is expected for initialization errors
      return
    }

    const { globalContext } = globalContextResult

    // Get global onError hooks using the proper hook system
    const onErrorHooks = getHookFromPageConfigGlobalCumulative(globalContext._pageConfigGlobal, 'onError')

    if (onErrorHooks.length === 0) return

    // Execute all onError hooks (cumulative)
    for (const hook of onErrorHooks) {
      try {
        // Call the hook function directly with just the error
        const hookFn = hook.hookFn as unknown as (error: Error) => void
        hookFn(err as unknown as Error)
      } catch (hookErr) {
        // If an individual onError hook throws, continue with the next one
        // We don't want one failing hook to prevent others from running
      }
    }

  } catch (hookErr) {
    // If anything fails while trying to execute the onError hooks, silently ignore
    // We don't want to create infinite loops or interfere with error page rendering
    // The original error logging has already happened
  }
}
