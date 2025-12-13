export { execHookServer }
export type { PageContextExecHookServer }

import { execHook, execHookDirect } from '../../../shared-server-client/hooks/execHook.js'
import {
  preparePageContextForPublicUsageServer,
  type PageContextForPublicUsageServer,
} from './preparePageContextForPublicUsageServer.js'
import type { PageContextConfig } from '../../../shared-server-client/getPageFiles.js'
import type { HookName } from '../../../types/Config.js'
import { getHookFromPageContextNew } from '../../../shared-server-client/hooks/getHook.js'

type PageContextExecHookServer = PageContextConfig & PageContextForPublicUsageServer
async function execHookServer(hookName: HookName, pageContext: PageContextExecHookServer) {
  // For onCreatePageContext, filter out .ssr. hooks during client-side navigation
  if (hookName === 'onCreatePageContext' && pageContext.isClientSideNavigation) {
    const allHooks = getHookFromPageContextNew(hookName, pageContext)
    // Filter out hooks with .ssr. in their file path
    const filteredHooks = allHooks.filter((hook) => !hook.hookFilePath.includes('.ssr.'))
    return await execHookDirect(filteredHooks, pageContext, preparePageContextForPublicUsageServer)
  }
  
  return await execHook(hookName, pageContext, preparePageContextForPublicUsageServer)
}
