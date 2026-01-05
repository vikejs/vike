import '../../assertEnvServer.js'

export { execHookServer }
export type { PageContextExecHookServer }

import { execHookList, PageContextExecHook } from '../../../shared-server-client/hooks/execHook.js'
import { getPageContextPublicServer } from './getPageContextPublicServer.js'
import type { PageContextConfig } from '../../../shared-server-client/getPageFiles.js'
import type { HookName } from '../../../types/Config.js'
import { getHooksFromPageContextNew } from '../../../shared-server-client/hooks/getHook.js'
import { getFileSuffixes } from '../../../shared-server-node/getFileSuffixes.js'

type PageContextExecHookServer = PageContextConfig & PageContextExecHook & { isClientSideNavigation: boolean }
async function execHookServer(hookName: HookName, pageContext: PageContextExecHookServer) {
  const allHooks = getHooksFromPageContextNew(hookName, pageContext)
  const hooks = !pageContext.isClientSideNavigation
    ? allHooks
    : // Don't execute `.ssr.js` hooks upon client-side navigation
      allHooks.filter((hook) => !getFileSuffixes(hook.hookFilePath).includes('ssr'))
  return await execHookList(hooks, pageContext, getPageContextPublicServer)
}
