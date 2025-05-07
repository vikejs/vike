export { executeHookServer }
export type { PageContextExecuteHookServer }

import { executeHookNew } from '../../../shared/hooks/executeHook.js'
import {
  preparePageContextForUserConsumptionServerSide,
  type PageContextForUserConsumptionServerSide
} from './preparePageContextForUserConsumptionServerSide.js'
import type { PageConfigUserFriendlyOld } from '../../../shared/getPageFiles.js'
import type { HookName } from '../../../shared/page-configs/Config.js'

type PageContextExecuteHookServer = PageConfigUserFriendlyOld & PageContextForUserConsumptionServerSide
async function executeHookServer(hookName: HookName, pageContext: PageContextExecuteHookServer) {
  return await executeHookNew(hookName, pageContext, (p) => {
    preparePageContextForUserConsumptionServerSide(p)
    return p
  })
}
