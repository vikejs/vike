export { logErrorServer }
export { tryExecOnErrorHook }

import pc from '@brillout/picocolors'
import { isCallable, isObject, getGlobalObject } from './utils.js'

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
    const { getGlobalContextServerInternalOptional } = require('./globalContext.js')
    const globalContextResult = getGlobalContextServerInternalOptional()

    if (!globalContextResult) {
      // Global context not available yet - this is expected for initialization errors
      return
    }

    const { globalContext } = globalContextResult

    // Execute global onError hooks
    const onErrorHooks = globalContext.config.onError
    if (!onErrorHooks || onErrorHooks.length === 0) return

    // Create a minimal page context for the global onError hooks
    const pageContext = {
      errorWhileRendering: err as unknown as Error,
      urlOriginal: '/_error', // Dummy URL since this is a global hook
      headers: null,
      // Add other minimal properties that might be expected
      _globalContext: globalContext,
    }

    // Execute all onError hooks (cumulative)
    for (const onErrorHook of onErrorHooks) {
      try {
        if (typeof onErrorHook === 'function') {
          onErrorHook(pageContext)
        }
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
