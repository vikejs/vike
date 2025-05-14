export { prepareGlobalContextForPublicUsage }
export type { GlobalContextPrepareMinimum }

import { assert, getProxyForPublicUsage } from './utils.js'

type GlobalContextPrepareMinimum = { _isOriginalObject: true; isGlobalContext: true }

function prepareGlobalContextForPublicUsage<GlobalContext extends GlobalContextPrepareMinimum>(
  globalContext: GlobalContext
) {
  assert(globalContext._isOriginalObject) // ensure we preserve the original object reference
  const globalContextPublic = getProxyForPublicUsage(globalContext, 'globalContext')
  return globalContextPublic
}
