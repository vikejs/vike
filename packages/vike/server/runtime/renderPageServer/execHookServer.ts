export { execHookServer }
export type { PageContextExecHookServer }

import { execHookDirect } from '../../../shared-server-client/hooks/execHook.js'
import {
  preparePageContextForPublicUsageServer,
  type PageContextForPublicUsageServer,
} from './preparePageContextForPublicUsageServer.js'
import type { PageContextConfig } from '../../../shared-server-client/getPageFiles.js'
import type { HookName } from '../../../types/Config.js'
import { getHookFromPageContextNew } from '../../../shared-server-client/hooks/getHook.js'
import { getFileSuffix } from '../../../shared-server-node/getFileSuffix.js'

type PageContextExecHookServer = PageContextConfig & PageContextForPublicUsageServer
async function execHookServer(hookName: HookName, pageContext: PageContextExecHookServer) {
  const allHooks = getHookFromPageContextNew(hookName, pageContext)
  const hooks = !pageContext.isClientSideNavigation
    ? allHooks
    : // Don't execute `.ssr.js` hooks upon client-side navigation
      allHooks.filter((hook) => !getFileSuffix(hook.hookFilePath).includes('ssr'))
  return await execHookDirect(hooks, pageContext, preparePageContextForPublicUsageServer)
}
