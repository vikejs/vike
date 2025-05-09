export { executeHookServer }
export type { PageContextExecuteHookServer }

import { executeHookNew } from '../../../shared/hooks/executeHook.js'
import {
  preparePageContextForPublicUsageServer,
  type PageContextForPublicUsageServer
} from './preparePageContextForPublicUsageServer.js'
import type { PageConfigUserFriendlyOld } from '../../../shared/getPageFiles.js'
import type { HookName } from '../../../shared/page-configs/Config.js'

type PageContextExecuteHookServer = PageConfigUserFriendlyOld & PageContextForPublicUsageServer
async function executeHookServer(hookName: HookName, pageContext: PageContextExecuteHookServer) {
  return await executeHookNew(hookName, pageContext, (p) => {
    preparePageContextForPublicUsageServer(p)
    return p
  })
}
