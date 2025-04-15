export { createPageContextShared }

import { getPageConfigGlobalUserFriendly } from './page-configs/getPageConfigUserFriendly.js'
import type { PageConfigGlobalRuntime } from './page-configs/PageConfig.js'
import { objectAssign } from './utils.js'

function createPageContextShared<T extends object>(pageContextCreated: T, pageConfigGlobal: PageConfigGlobalRuntime) {
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

  return pageContextCreated
}
