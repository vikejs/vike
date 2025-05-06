export { createPageContextShared }

import { executeHookGenericGlobalCumulative } from './hooks/executeHookGeneric.js'
import { getConfigsUserFriendlyGlobal } from './page-configs/getConfigsUserFriendly.js'
import type { PageConfigGlobalRuntime } from './page-configs/PageConfig.js'
import { objectAssign } from './utils.js'

async function createPageContextShared<T extends object>(
  pageContextCreated: T,
  pageConfigGlobal: PageConfigGlobalRuntime
) {
  const pageConfigGlobalUserFriendly = getConfigsUserFriendlyGlobal({
    pageConfigGlobalValues: pageConfigGlobal.configValues
  })

  objectAssign(
    pageContextCreated,
    {
      isPageContext: true as const,
      ...pageConfigGlobalUserFriendly
    },
    true
  )

  await executeHookGenericGlobalCumulative(
    'onCreatePageContext',
    pageConfigGlobal,
    pageContextCreated,
    pageContextCreated
  )

  return pageContextCreated
}
