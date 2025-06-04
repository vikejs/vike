export { execHookServer }
export type { PageContextExecuteHookServer }

import { execHook } from '../../../shared/hooks/execHook.js'
import {
  preparePageContextForPublicUsageServer,
  type PageContextForPublicUsageServer
} from './preparePageContextForPublicUsageServer.js'
import type { VikeConfigPublicPageLazy } from '../../../shared/getPageFiles.js'
import type { HookName } from '../../../shared/page-configs/Config.js'

type PageContextExecuteHookServer = VikeConfigPublicPageLazy & PageContextForPublicUsageServer
async function execHookServer(hookName: HookName, pageContext: PageContextExecuteHookServer) {
  return await execHook(hookName, pageContext, (p) => {
    preparePageContextForPublicUsageServer(p)
    return p
  })
}
