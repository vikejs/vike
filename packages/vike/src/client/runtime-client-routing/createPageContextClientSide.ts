export { createPageContextClientSide }
export type PageContextCreatedClient = Awaited<ReturnType<typeof createPageContextClientSide>>

import { createPageContextObject, createPageContextShared } from '../../shared-server-client/createPageContextShared.js'
import { getPageContextUrlComputed } from '../../shared-server-client/getPageContextUrlComputed.js'
import { getBaseServer } from './getBaseServer.js'
import { getGlobalContextClientInternal } from './getGlobalContextClientInternal.js'
import { assert, updateType, isBaseServer, objectAssign } from './utils.js'

async function createPageContextClientSide(urlOriginal: string) {
  const baseServer = getBaseServer()
  assert(isBaseServer(baseServer))

  const pageContextCreated = createPageContextObject()
  objectAssign(pageContextCreated, {
    isClientSide: true as const,
    isPrerendering: false as const,
    urlOriginal,
    _urlHandler: null,
    _baseServer: baseServer,
  })
  const pageContextUrlComputed = getPageContextUrlComputed(pageContextCreated)
  objectAssign(pageContextCreated, pageContextUrlComputed)

  const globalContext = await getGlobalContextClientInternal()
  objectAssign(pageContextCreated, {
    _globalContext: globalContext,
    _pageFilesAll: globalContext._pageFilesAll, // TO-DO/next-major-release: remove
  })
  const pageContextAugmented = createPageContextShared(pageContextCreated, globalContext._globalConfigPublic)
  updateType(pageContextCreated, pageContextAugmented)

  return pageContextCreated
}
