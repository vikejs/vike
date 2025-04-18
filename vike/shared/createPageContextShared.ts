export { createPageContextShared }

import { executeHookGenericGlobalCumulative } from './hooks/executeHookGeneric.js'
import { getPageConfigGlobalUserFriendly } from './page-configs/getPageConfigUserFriendly.js'
import type { PageConfigGlobalRuntime } from './page-configs/PageConfig.js'
import { objectAssign } from './utils.js'

async function createPageContextShared<T extends object>(
  pageContextCreated: T,
  pageConfigGlobal: PageConfigGlobalRuntime
) {
  const pageConfigGlobalUserFriendly = getPageConfigGlobalUserFriendly({
    pageConfigGlobalValues: pageConfigGlobal.configValues
  })

  objectAssign(
    pageContextCreated,
    {
      _isPageContextObject: true,
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
