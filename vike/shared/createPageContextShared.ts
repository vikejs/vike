export { createPageContextShared }

import { executeHookGenericGlobalCumulative } from './hooks/executeHook.js'
import type { PageConfigUserFriendly } from './page-configs/getUserFriendlyConfigs.js'
import type { PageConfigGlobalRuntime } from './page-configs/PageConfig.js'
import { objectAssign } from './utils.js'

async function createPageContextShared<T extends object>(
  pageContextCreated: T,
  pageConfigGlobal: PageConfigGlobalRuntime,
  userFriendlyConfigsGlobal: PageConfigUserFriendly
) {
  objectAssign(pageContextCreated, { isPageContext: true as const }, true)

  objectAssign(pageContextCreated, userFriendlyConfigsGlobal)

  await executeHookGenericGlobalCumulative(
    'onCreatePageContext',
    pageConfigGlobal,
    pageContextCreated,
    pageContextCreated
  )

  return pageContextCreated
}
