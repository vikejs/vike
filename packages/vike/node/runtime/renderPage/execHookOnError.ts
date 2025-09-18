export { execHookOnError }

import { isObject, getGlobalObject } from '../utils.js'
import { getGlobalContextServerInternalOptional } from '../globalContext.js'
import { getHookFromPageConfigGlobalCumulative } from '../../../shared/hooks/getHook.js'

const globalObject = getGlobalObject('renderPage/execHookOnError.ts', {
  seen: new WeakSet(),
})

function execHookOnError(err: unknown) {
  // TODO only skip the check, still run +onError
  if (!isObject(err)) return

  if (globalObject.seen.has(err)) return
  globalObject.seen.add(err)

  // Check if global context is available synchronously
  const globalContextResult = getGlobalContextServerInternalOptional()
  if (!globalContextResult) {
    // Global context not available yet - this is expected for initialization errors
    return
  }
  const { globalContext } = globalContextResult

  const onErrorHooks = getHookFromPageConfigGlobalCumulative(globalContext._pageConfigGlobal, 'onError')
  for (const hook of onErrorHooks) {
    try {
      // TODO: err is always unknown
      const hookFn = hook.hookFn as unknown as (error: Error) => void
      hookFn(err as unknown as Error)
    } catch (hookErr) {
      console.error(hookErr)
    }
  }
}
