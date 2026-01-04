export { getGlobalContextPublicShared }
export type { GlobalContextPublicMinimum }

import { getPublicProxy } from './getPublicProxy.js'
import { assert } from './utils.js'
import type { PageConfigGlobalRuntime } from '../types/PageConfig.js'

type GlobalContextPublicMinimum = {
  _isOriginalObject: true
  isGlobalContext: true
  _pageConfigGlobal: PageConfigGlobalRuntime
}

function getGlobalContextPublicShared<GlobalContext extends GlobalContextPublicMinimum>(globalContext: GlobalContext) {
  assert(globalContext._isOriginalObject) // ensure we preserve the original object reference
  const globalContextPublic = getPublicProxy(globalContext, 'globalContext')
  return globalContextPublic
}
