import '../../assertEnvServer.js'

export { execHookOnError }

import { assert } from '../../../utils/assert.js'
import { getGlobalObject } from '../../../utils/getGlobalObject.js'
import { isObject } from '../../../utils/isObject.js'
import { execHookSingleSync } from '../../../shared-server-client/hooks/execHook.js'
import { getGlobalContextServerInternalOptional } from '../globalContext.js'
import { getHooksFromPageConfigGlobalCumulative } from '../../../shared-server-client/hooks/getHook.js'
import type {
  PageContextCreatedServer,
  PageContextCreatedServerWithoutGlobalContext,
} from './createPageContextServer.js'
import { getPageContextPublicServer } from './getPageContextPublicServer.js'

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
      execHookSingleSync(hook, globalContext, pageContext, getPageContextPublicServer, () =>
        hook.hookFn(err, pageContext),
      )
    } catch (hookErr) {
      console.error(hookErr)
    }
  }
}
