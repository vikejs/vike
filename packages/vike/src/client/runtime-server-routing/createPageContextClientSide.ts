export { createPageContextClientSide }
export type PageContextCreatedClient_ServerRouting = Awaited<ReturnType<typeof createPageContextClientSide>>
export type PageContextCreatedClientBase_ServerRouting = Awaited<ReturnType<typeof createPageContextBase>>

import { updateType, objectAssign } from './utils.js'

import { createPageContextObject, createPageContextShared } from '../../shared-server-client/createPageContextShared.js'
import { getGlobalContextClientInternal } from './getGlobalContextClientInternal.js'

async function createPageContextClientSide() {
  const pageContext = createPageContextBase()

  const globalContext = await getGlobalContextClientInternal()
  objectAssign(pageContext, {
    _globalContext: globalContext,
    _pageFilesAll: globalContext._pageFilesAll, // TO-DO/next-major-release: remove
  })

  // Sets pageContext.config to global configs
  updateType(pageContext, createPageContextShared(pageContext, globalContext._globalConfigPublic))

  return pageContext
}

function createPageContextBase() {
  const pageContextCreated = createPageContextObject()
  objectAssign(pageContextCreated, {
    isClientSide: true as const,
    isPrerendering: false as const,
    isHydration: true as const,
    isBackwardNavigation: null,
    isHistoryNavigation: null,
    _hasPageContextFromServer: true as const,
  })
  return pageContextCreated
}
