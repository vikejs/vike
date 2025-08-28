export { createPageContextClientSide }
export type PageContextCreated = Awaited<ReturnType<typeof createPageContextClientSide>>

import { createPageContextObject, createPageContextShared } from '../../shared/createPageContextShared.js'
import { getPageContextUrlComputed } from '../../shared/getPageContextUrlComputed.js'
import { getBaseServer } from './getBaseServer.js'
import { getGlobalContextClientInternal } from './globalContext.js'
import { assert, updateType, isBaseServer, objectAssign } from './utils.js'

async function createPageContextClientSide(urlOriginal: string) {
  const globalContext = await getGlobalContextClientInternal()

  const baseServer = getBaseServer()
  assert(isBaseServer(baseServer))

  const pageContextCreated = createPageContextObject()
  objectAssign(pageContextCreated, {
    isClientSide: true as const,
    isPrerendering: false as const,
    urlOriginal,
    _globalContext: globalContext,
    _pageFilesAll: globalContext._pageFilesAll, // TO-DO/next-major-release: remove
    _urlHandler: null,
    _urlRewrite: null as null | string,
    _baseServer: baseServer,
  })
  const pageContextUrlComputed = getPageContextUrlComputed(pageContextCreated)
  objectAssign(pageContextCreated, pageContextUrlComputed)

  const pageContextAugmented = createPageContextShared(pageContextCreated, globalContext._globalConfigPublic)
  updateType(pageContextCreated, pageContextAugmented)

  return pageContextCreated
}
