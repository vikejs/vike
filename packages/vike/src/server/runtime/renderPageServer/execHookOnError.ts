export { execHookOnError }

import { isObject, getGlobalObject } from '../../utils.js'
import { execHookVanillaSync } from '../../../shared-server-client/hooks/execHook.js'
import { getGlobalContextServerInternalOptional } from '../globalContext.js'
import { getHookFromPageConfigGlobalCumulative } from '../../../shared-server-client/hooks/getHook.js'
import type { PageContextCreatedServerMinimum } from './createPageContextServerSide.js'

const globalObject = getGlobalObject('renderPageServer/execHookOnError.ts', {
  seen: new WeakSet(),
})

function execHookOnError(err: unknown, pageContext: PageContextCreatedServerMinimum | null) {
  if (isObject(err)) {
    if (globalObject.seen.has(err)) return
    globalObject.seen.add(err)
  }

  const globalContext = getGlobalContextServerInternalOptional()
  if (!globalContext) return

  const hooks = getHookFromPageConfigGlobalCumulative<unknown>(globalContext._pageConfigGlobal, 'onError')
  for (const hook of hooks) {
    try {
      execHookVanillaSync(() => hook.hookFn(err, pageContext), hook, globalContext)
    } catch (hookErr) {
      console.error(hookErr)
    }
  }
}
