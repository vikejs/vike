export { prepareGlobalContextForPublicUsage }

import { getPublicProxy } from './utils.js'

function prepareGlobalContextForPublicUsage<GlobalContext extends Record<string, unknown>>(
  globalContext: GlobalContext
) {
  const globalContextPublic = getPublicProxy(globalContext, 'globalContext')
  return globalContextPublic
}
