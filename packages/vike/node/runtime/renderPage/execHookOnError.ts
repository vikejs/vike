export { execHookOnError }

import { isObject, getGlobalObject } from '../utils.js'
import { getGlobalContextServerInternalOptional } from '../globalContext.js'
import { getHookFromPageConfigGlobalCumulative } from '../../../shared/hooks/getHook.js'

const globalObject = getGlobalObject('renderPage/execHookOnError.ts', {
  seen: new WeakSet(),
})

function execHookOnError(err: unknown) {
  if (isObject(err)) {
    // Track seen errors but don't skip execution
    globalObject.seen.add(err)
  }

  const globalContext = getGlobalContextServerInternalOptional()
  if (!globalContext) return

  const hooks = getHookFromPageConfigGlobalCumulative<Error>(globalContext._pageConfigGlobal, 'onError')

  // Convert unknown error to Error object as expected by the hook
  const error = err instanceof Error ? err : new Error(String(err))

  for (const hook of hooks) {
    try {
      hook.hookFn(error)
    } catch (hookErr) {
      console.error(hookErr)
    }
  }
}
