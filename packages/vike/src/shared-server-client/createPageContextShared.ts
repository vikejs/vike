export { createPageContextShared }
export { createPageContextObject }
export type { PageContextCreated }

import { changeEnumerable, objectAssign } from './utils.js'
import type { GlobalConfigPublic } from './page-configs/resolveVikeConfigPublic.js'
import type { PageContextCreatedClient } from '../client/runtime-client-routing/createPageContextClientSide.js'
import type { PageContextCreatedServer } from '../server/runtime/renderPageServer/createPageContextServerSide.js'
import type { PageContextCreatedClient_ServerRouting } from '../client/runtime-server-routing/createPageContextClientSide.js'

type PageContextCreated = PageContextCreatedServer | PageContextCreatedClient | PageContextCreatedClient_ServerRouting

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
