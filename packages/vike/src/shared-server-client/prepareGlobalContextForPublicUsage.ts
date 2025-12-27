export { prepareGlobalContextForPublicUsage }
export type { GlobalContextPrepareMinimum }

import { getProxyForPublicUsage } from './getProxyForPublicUsage.js'
import { assert } from './utils.js'
import type { PageConfigGlobalRuntime } from '../types/PageConfig.js'

type GlobalContextPrepareMinimum = {
  _isOriginalObject: true
  isGlobalContext: true
  _pageConfigGlobal: PageConfigGlobalRuntime
}

function prepareGlobalContextForPublicUsage<GlobalContext extends GlobalContextPrepareMinimum>(
  globalContext: GlobalContext,
) {
  assert(globalContext._isOriginalObject) // ensure we preserve the original object reference
  const globalContextPublic = getProxyForPublicUsage(globalContext, 'globalContext')
  return globalContextPublic
}
