export { execHookOnError }

import { isObject, getGlobalObject } from '../../utils.js'
import { getGlobalContextServerInternalOptional } from '../globalContext.js'
import { getHookFromPageConfigGlobalCumulative } from '../../../shared-server-client/hooks/getHook.js'
import { execHookWithWrappers } from '../../../shared-server-client/hooks/execHook.js'
import type { PageContext_logRuntime } from '../loggerRuntime.js'

const globalObject = getGlobalObject('renderPageServer/execHookOnError.ts', {
  seen: new WeakSet(),
})

function execHookOnError(err: unknown, pageContext: PageContext_logRuntime) {
  if (isObject(err)) {
    if (globalObject.seen.has(err)) return
    globalObject.seen.add(err)
  }

  const globalContext = getGlobalContextServerInternalOptional()
  if (!globalContext) return

  const hooks = getHookFromPageConfigGlobalCumulative<unknown>(globalContext._pageConfigGlobal, 'onError')
  for (const hook of hooks) {
    try {
      execHookWithWrappers(hook, globalContext, err, pageContext)
    } catch (hookErr) {
      console.error(hookErr)
    }
  }
}
