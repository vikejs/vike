export { execHookServer }
export type { PageContextExecHookServer }

import { execHook } from '../../../shared/hooks/execHook.js'
import {
  preparePageContextForPublicUsageServer,
  type PageContextForPublicUsageServer,
} from './preparePageContextForPublicUsageServer.js'
import type { PageContextConfig } from '../../../shared/getPageFiles.js'
import type { HookName } from '../../../types/Config.js'

type PageContextExecHookServer = PageContextConfig & PageContextForPublicUsageServer
async function execHookServer(hookName: HookName, pageContext: PageContextExecHookServer) {
  return await execHook(hookName, pageContext, preparePageContextForPublicUsageServer)
}
