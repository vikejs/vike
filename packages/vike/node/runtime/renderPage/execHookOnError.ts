export { execHookOnError }

import { isObject, getGlobalObject } from '../utils.js'
import { getGlobalContextServerInternalOptional } from '../globalContext.js'
import { getHookFromPageConfigGlobalCumulative } from '../../../shared/hooks/getHook.js'

const globalObject = getGlobalObject('renderPage/execHookOnError.ts', {
  seen: new WeakSet(),
})

function execHookOnError(err: unknown) {
  if (isObject(err)) {
    if (globalObject.seen.has(err)) return
    globalObject.seen.add(err)
  }

  const globalContext = getGlobalContextServerInternalOptional()
  if (!globalContext) return

  const onErrorHooks = getHookFromPageConfigGlobalCumulative(globalContext._pageConfigGlobal, 'onError')
  for (const hook of onErrorHooks) {
    try {
      // TODO: avoid ts-ignore
      // @ts-ignore
      hook.hookFn(err)
    } catch (hookErr) {
      console.error(hookErr)
    }
  }
}
