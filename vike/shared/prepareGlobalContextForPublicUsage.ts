export { prepareGlobalContextForPublicUsage }

import { getProxyForPublicUsage } from './utils.js'

function prepareGlobalContextForPublicUsage<GlobalContext extends Record<string, unknown>>(
  globalContext: GlobalContext
) {
  const globalContextPublic = getProxyForPublicUsage(globalContext, 'globalContext')
  return globalContextPublic
}
