export { execHookOnError }

import { isObject, getGlobalObject } from '../utils.js'
import { getGlobalContextServerInternalOptional } from '../globalContext.js'
import { getHookFromPageConfigGlobalCumulative } from '../../../shared/hooks/getHook.js'

const globalObject = getGlobalObject('renderPage/execHookOnError.ts', {
  seen: new WeakSet(),
})

function execHookOnError(errStr: string, err: unknown) {
  if (isObject(err)) {
    if (globalObject.seen.has(err)) return
    globalObject.seen.add(err)
  }

  const globalContext = getGlobalContextServerInternalOptional()
  if (!globalContext) return

  const hooks = getHookFromPageConfigGlobalCumulative<[string, { err: unknown }]>(globalContext._pageConfigGlobal, 'onError')
  for (const hook of hooks) {
    try {
      hook.hookFn(errStr, { err })
    } catch (hookErr) {
      console.error(hookErr)
    }
  }
}
