export { createPageContextShared }

import { executeHookGenericGlobalCumulative } from './hooks/executeHookGeneric.js'
import { getUserFriendlyConfigsGlobal } from './page-configs/getUserFriendlyConfigs.js'
import type { PageConfigGlobalRuntime } from './page-configs/PageConfig.js'
import { objectAssign } from './utils.js'

async function createPageContextShared<T extends object>(
  pageContextCreated: T,
  pageConfigGlobal: PageConfigGlobalRuntime
) {
  const pageConfigGlobalUserFriendly = getUserFriendlyConfigsGlobal({
    pageConfigGlobalValues: pageConfigGlobal.configValues
  })

  objectAssign(pageContextCreated, { isPageContext: true as const }, true)

  objectAssign(pageContextCreated, pageConfigGlobalUserFriendly, true)

  await executeHookGenericGlobalCumulative(
    'onCreatePageContext',
    pageConfigGlobal,
    pageContextCreated,
    pageContextCreated
  )

  return pageContextCreated
}
