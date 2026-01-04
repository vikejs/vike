export { getGlobalContextPublicShared }
export type { GlobalContextPublicMinimum }

import { getProxyForPublicUsage } from './getProxyForPublicUsage.js'
import { assert } from './utils.js'
import type { PageConfigGlobalRuntime } from '../types/PageConfig.js'

// TODO: rename?
type GlobalContextPublicMinimum = {
  _isOriginalObject: true
  isGlobalContext: true
  _pageConfigGlobal: PageConfigGlobalRuntime
}

function getGlobalContextPublicShared<GlobalContext extends GlobalContextPublicMinimum>(globalContext: GlobalContext) {
  assert(globalContext._isOriginalObject) // ensure we preserve the original object reference
  const globalContextPublic = getProxyForPublicUsage(globalContext, 'globalContext')
  return globalContextPublic
}
