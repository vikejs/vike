export { createPageContextShared }
export { createPageContextObject }
export type { PageContextCreated }
export type { PageContextCreatedMinimum }

import { changeEnumerable, objectAssign } from './utils.js'
import type { GlobalConfigPublic } from './page-configs/resolveVikeConfigPublic.js'
import type { PageContextCreatedClient } from '../client/runtime-client-routing/createPageContextClientSide.js'
import type { PageContextCreatedServer } from '../server/runtime/renderPageServer/createPageContextServerSide.js'
import type { PageContextCreatedClient_ServerRouting } from '../client/runtime-server-routing/createPageContextClientSide.js'

type PageContextCreated = PageContextCreatedServer | PageContextCreatedClient | PageContextCreatedClient_ServerRouting

/* Ideally we'd use this, but I couldn't make it work.
type PageContextCreated =
  | PageContextCreatedServer
  | PageContextCreatedClient
  | PageContextCreatedClient_ServerRouting
/*/
type PageContextCreatedMinimum = {
  _isOriginalObject: true
  isPageContext: true
  isClientSide: boolean
  // ... manually add common types here
}
type IsSubset<A, B> = B extends A ? true : false
// @ts-ignore unused type test
type _test = [
  Expect<IsSubset<PageContextCreatedMinimum, PageContextCreatedServer>>,
  Expect<IsSubset<PageContextCreatedMinimum, PageContextCreatedClient>>,
  Expect<IsSubset<PageContextCreatedMinimum, PageContextCreatedClient_ServerRouting>>,
]
type Expect<T extends true> = T
//*/

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
