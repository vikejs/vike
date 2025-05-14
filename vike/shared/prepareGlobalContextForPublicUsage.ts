export { prepareGlobalContextForPublicUsage }
export type { GlobalContextPrepareMinimum }

import { getProxyForPublicUsage } from './utils.js'

type GlobalContextPrepareMinimum = { _isOriginalObject: true; isGlobalContext: true }

function prepareGlobalContextForPublicUsage<GlobalContext extends GlobalContextPrepareMinimum>(
  globalContext: GlobalContext
) {
  const globalContextPublic = getProxyForPublicUsage(globalContext, 'globalContext')
  return globalContextPublic
}
