export { createPageContextShared }

import { execHookGlobal } from './hooks/execHook.js'
import type { PageConfigUserFriendly } from './page-configs/getUserFriendlyConfigs.js'
import type { PageConfigGlobalRuntime } from './page-configs/PageConfig.js'
import { type PageContextPrepareMinimum, preparePageContextForPublicUsage } from './preparePageContextForPublicUsage.js'
import { objectAssign } from './utils.js'

async function createPageContextShared<T extends PageContextPrepareMinimum>(
  pageContextCreated: T,
  pageConfigGlobal: PageConfigGlobalRuntime,
  userFriendlyConfigsGlobal: PageConfigUserFriendly
) {
  objectAssign(pageContextCreated, userFriendlyConfigsGlobal)

  await execHookGlobal(
    'onCreatePageContext',
    pageConfigGlobal,
    pageContextCreated,
    pageContextCreated,
    preparePageContextForPublicUsage
  )

  return pageContextCreated
}
