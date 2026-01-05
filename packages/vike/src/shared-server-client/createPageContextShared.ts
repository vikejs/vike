export { createPageContextShared }
export { createPageContextObject }
export type { PageContextCreated }

import { changeEnumerable } from '../../utils/changeEnumerable.js'
import { objectAssign } from '../../utils/objectAssign.js'

import type { GlobalConfigPublic } from './page-configs/resolveVikeConfigPublic.js'
import type { PageContextCreatedClient } from '../client/runtime-client-routing/createPageContextClient.js'
import type { PageContextCreatedServer } from '../server/runtime/renderPageServer/createPageContextServer.js'
import type { PageContextCreatedClient_ServerRouting } from '../client/runtime-server-routing/createPageContextClient.js'
import type { GlobalContextPublicMinimum } from './getGlobalContextPublicShared.js'

// Ideally we'd always use PageContextCreatedPrecise instead of PageContextCreated, but it turns out to be difficult
type PageContextCreated = {
  _isOriginalObject: true
  isPageContext: true
  isClientSide: boolean
  _globalContext: GlobalContextPublicMinimum
  // ... manually add common types here
}
type IsSubset<A, B> = B extends A ? true : false
// @ts-ignore unused type test
type _test = [
  Expect<IsSubset<PageContextCreated, PageContextCreatedServer>>,
  Expect<IsSubset<PageContextCreated, PageContextCreatedClient>>,
  Expect<IsSubset<PageContextCreated, PageContextCreatedClient_ServerRouting>>,
]
type Expect<T extends true> = T
// @ts-ignore Isn't used yet. It is unusable? See `PageContextCreated` comment above.
type PageContextCreatedPrecise =
  | PageContextCreatedServer
  | PageContextCreatedClient
  | PageContextCreatedClient_ServerRouting

function createPageContextShared<T extends Record<string, unknown>>(
  pageContextCreated: T,
  globalConfigPublic: GlobalConfigPublic,
) {
  objectAssign(pageContextCreated, globalConfigPublic)
  return pageContextCreated
}

function createPageContextObject() {
  const pageContext = {
    _isOriginalObject: true as const,
    isPageContext: true as const,
  }
  changeEnumerable(pageContext, '_isOriginalObject', false)
  return pageContext
}
