export { createPageContextShared }

import { executeHookGlobalCumulative } from './hooks/executeHook.js'
import type { PageConfigUserFriendly } from './page-configs/getUserFriendlyConfigs.js'
import type { PageConfigGlobalRuntime } from './page-configs/PageConfig.js'
import { objectAssign } from './utils.js'

async function createPageContextShared<T extends object>(
  pageContextCreated: T,
  pageConfigGlobal: PageConfigGlobalRuntime,
  userFriendlyConfigsGlobal: PageConfigUserFriendly
) {
  objectAssign(pageContextCreated, userFriendlyConfigsGlobal)

  await executeHookGlobalCumulative('onCreatePageContext', pageConfigGlobal, pageContextCreated, pageContextCreated)

  return pageContextCreated
}
