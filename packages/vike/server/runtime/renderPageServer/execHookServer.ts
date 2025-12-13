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

type PageContextExecHookServer = PageContextConfig & PageContextForPublicUsageServer
async function execHookServer(hookName: HookName, pageContext: PageContextExecHookServer) {
  // Get all hooks for this hookName
  const allHooks = getHookFromPageContextNew(hookName, pageContext)
  
  // For onCreatePageContext, filter out .ssr. hooks during client-side navigation
  const hooks =
    hookName === 'onCreatePageContext' && pageContext.isClientSideNavigation
      ? allHooks.filter((hook) => !hook.hookFilePath.includes('.ssr.'))
      : allHooks
  
  return await execHookDirect(hooks, pageContext, preparePageContextForPublicUsageServer)
}
