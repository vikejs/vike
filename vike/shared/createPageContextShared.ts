export { createPageContextShared }
export { createPageContextObject }

import { getProxyForMutationTracking } from './getProxyForPublicUsage.js'
import { execHookGlobal } from './hooks/execHook.js'
import type { PageConfigUserFriendly } from './page-configs/getUserFriendlyConfigs.js'
import type { PageConfigGlobalRuntime } from './page-configs/PageConfig.js'
import { type PageContextPrepareMinimum, preparePageContextForPublicUsage } from './preparePageContextForPublicUsage.js'
import { changeEnumerable, objectAssign } from './utils.js'

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

function createPageContextObject() {
  const pageContext = {
    _isOriginalObject: true as const,
    isPageContext: true as const
  }
  changeEnumerable(pageContext, '_isOriginalObject', false)
  const pageContextWithProxy = getProxyForMutationTracking(pageContext)
  return pageContextWithProxy
}
