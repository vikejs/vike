export { execHookOnError }

import { isObject, getGlobalObject } from '../utils.js'
import { getGlobalContextServerInternalOptional } from '../globalContext.js'
import { getHookFromPageConfigGlobalCumulative } from '../../../shared/hooks/getHook.js'

const globalObject = getGlobalObject('renderPage/execHookOnError.ts', {
  seen: new WeakSet(),
})

function execHookOnError(err: unknown) {
  if (!isObject(err)) return

  // Track seen errors but don't skip execution (per TODO above)
  globalObject.seen.add(err)

  // Check if global context is available synchronously
  const globalContextResult = getGlobalContextServerInternalOptional()
  if (!globalContextResult) {
    // Global context not available yet - this is expected for initialization errors
    return
  }
  const { globalContext } = globalContextResult

  const onErrorHooks = getHookFromPageConfigGlobalCumulative(globalContext._pageConfigGlobal, 'onError')

  // Convert unknown error to proper Error object
  const error = err instanceof Error ? err : new Error(String(err))

  for (const hook of onErrorHooks) {
    try {
      const hookFn = hook.hookFn as unknown as (error: Error) => void
      hookFn(error)
    } catch (hookErr) {
      console.error(hookErr)
    }
  }
}
