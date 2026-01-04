export { execHookOnError }

import { isObject, getGlobalObject, assert } from '../../utils.js'
import { execHookBase } from '../../../shared-server-client/hooks/execHook.js'
import { getGlobalContextServerInternalOptional } from '../globalContext.js'
import { getHooksFromPageConfigGlobalCumulative } from '../../../shared-server-client/hooks/getHook.js'
import type {
  PageContextCreatedServer,
  PageContextCreatedServerWithoutGlobalContext,
} from './createPageContextServer.js'

const globalObject = getGlobalObject('renderPageServer/execHookOnError.ts', {
  seen: new WeakSet(),
})

function execHookOnError(
  err: unknown,
  pageContext: null | PageContextCreatedServerWithoutGlobalContext | PageContextCreatedServer,
) {
  if (isObject(err)) {
    if (globalObject.seen.has(err)) return
    globalObject.seen.add(err)
  }

  const globalContext = getGlobalContextServerInternalOptional()
  if (!globalContext) return
  assert(pageContext === null || '_globalContext' in pageContext)

  const hooks = getHooksFromPageConfigGlobalCumulative<unknown>(globalContext._pageConfigGlobal, 'onError')
  for (const hook of hooks) {
    try {
      execHookBase(() => hook.hookFn(err, pageContext), hook, globalContext, pageContext)
    } catch (hookErr) {
      console.error(hookErr)
    }
  }
}
