export { createPageContextClientSide }
export type PageContextCreatedClient_ServerRouting = Awaited<ReturnType<typeof createPageContextClientSide>>

import { updateType, objectAssign } from './utils.js'

import { createPageContextObject, createPageContextShared } from '../../shared-server-client/createPageContextShared.js'
import { getGlobalContextClientInternal } from './getGlobalContextClientInternal.js'

async function createPageContextClientSide() {
  const pageContextCreated = createPageContextObject()
  objectAssign(pageContextCreated, {
    isClientSide: true as const,
    isPrerendering: false as const,
    isHydration: true as const,
    isBackwardNavigation: null,
    isHistoryNavigation: null,
    _hasPageContextFromServer: true as const,
  })

  const globalContext = await getGlobalContextClientInternal()
  objectAssign(pageContextCreated, {
    _globalContext: globalContext,
    _pageFilesAll: globalContext._pageFilesAll, // TO-DO/next-major-release: remove
  })

  // Sets pageContext.config to global configs
  updateType(pageContextCreated, createPageContextShared(pageContextCreated, globalContext._globalConfigPublic))

  return pageContextCreated
}
