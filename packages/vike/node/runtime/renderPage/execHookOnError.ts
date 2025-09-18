export { execHookOnError }

import { isObject, getGlobalObject } from '../utils.js'
import { getGlobalContextServerInternalOptional } from '../globalContext.js'
import { getHookFromPageConfigGlobalCumulative } from '../../../shared/hooks/getHook.js'

// Track which errors have already had their onError hook executed
const globalObject = getGlobalObject('renderPage/execHookOnError.ts', {
  onErrorHookExecuted: new WeakSet<object>(),
})

function execHookOnError(err: unknown) {
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
}
