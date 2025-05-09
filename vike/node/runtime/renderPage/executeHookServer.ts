export { executeHookServer }
export type { PageContextExecuteHookServer }

import { executeHookNew } from '../../../shared/hooks/executeHook.js'
import {
  preparePageContextForUserConsumptionServer,
  type PageContextForUserConsumptionServer
} from './preparePageContextForUserConsumptionServer.js'
import type { PageConfigUserFriendlyOld } from '../../../shared/getPageFiles.js'
import type { HookName } from '../../../shared/page-configs/Config.js'

type PageContextExecuteHookServer = PageConfigUserFriendlyOld & PageContextForUserConsumptionServer
async function executeHookServer(hookName: HookName, pageContext: PageContextExecuteHookServer) {
  return await executeHookNew(hookName, pageContext, (p) => {
    preparePageContextForUserConsumptionServer(p)
    return p
  })
}
