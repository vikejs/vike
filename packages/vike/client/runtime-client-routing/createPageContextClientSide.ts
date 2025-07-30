export { createPageContextClientSide }
export type PageContextCreated = Awaited<ReturnType<typeof createPageContextClientSide>>

import { createPageContextObject, createPageContextShared } from '../../shared/createPageContextShared.js'
import { getPageContextUrlComputed } from '../../shared/getPageContextUrlComputed.js'
import { getBaseServer } from './getBaseServer.js'
import { getGlobalContextClientInternal } from './globalContext.js'
import { assert, augmentType, isBaseServer, objectAssign } from './utils.js'

async function createPageContextClientSide(urlOriginal: string) {
  console.log('getGlobalContextClientInternal() before')
  const globalContext = await getGlobalContextClientInternal()
  console.log('getGlobalContextClientInternal() after')
  assert(globalContext)

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

  const pageContextAugmented = createPageContextShared(pageContextCreated, globalContext._vikeConfigPublicGlobal)
  augmentType(pageContextCreated, pageContextAugmented)

  return pageContextCreated
}
