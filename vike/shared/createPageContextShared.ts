export { createPageContextShared }

import { execHookGlobalCumulative } from './hooks/execHook.js'
import type { PageConfigUserFriendly } from './page-configs/getUserFriendlyConfigs.js'
import type { PageConfigGlobalRuntime } from './page-configs/PageConfig.js'
import { type PageContextMinimum, preparePageContextForPublicUsage } from './preparePageContextForPublicUsage.js'
import { objectAssign } from './utils.js'

async function createPageContextShared<T extends PageContextMinimum>(
  pageContextCreated: T,
  pageConfigGlobal: PageConfigGlobalRuntime,
  userFriendlyConfigsGlobal: PageConfigUserFriendly
) {
  objectAssign(pageContextCreated, userFriendlyConfigsGlobal)

  await execHookGlobalCumulative(
    'onCreatePageContext',
    pageConfigGlobal,
    pageContextCreated,
    pageContextCreated,
    preparePageContextForPublicUsage
  )

  return pageContextCreated
}
