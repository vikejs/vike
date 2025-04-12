export { getGlobalContext }
export type { GlobalContextPublicClientSide }

import { getGlobalObject } from './utils.js'

type GlobalContex = Record<string, unknown>
// Same type for now
type GlobalContextPublicClientSide = GlobalContex

const globalObject = getGlobalObject<{
  globalContext?: GlobalContextPublicClientSide
}>('client-routing-runtime/globalContextClientSide.ts', {})

function getGlobalContext(): GlobalContextPublicClientSide {
  if (!globalObject.globalContext) globalObject.globalContext = {}
  return globalObject.globalContext
}
