export { createPageContextClientSide }

import { createPageContextShared } from '../../shared/createPageContextShared.js'
import { getPageContextUrlComputed } from '../../shared/getPageContextUrlComputed.js'
import { getBaseServer } from './getBaseServer.js'
import { getGlobalContext } from './globalContext.js'
import { assert, augmentType, isBaseServer, objectAssign } from './utils.js'

async function createPageContextClientSide(urlOriginal: string) {
  const globalContext = await getGlobalContext()

  const baseServer = getBaseServer()
  assert(isBaseServer(baseServer))

  const pageContextCreated = {
    /* Don't spread globalContext for now? Or never spread it as it leads to confusion? The convenience isn't worth the added confusion?
    ...globalContext, // least precedence
    */
    globalContext,
    _pageFilesAll: globalContext._pageFilesAll,
    _pageConfigs: globalContext._pageConfigs,
    _pageConfigGlobal: globalContext._pageConfigGlobal,
    _allPageIds: globalContext._allPageIds,
    _pageRoutes: globalContext._pageRoutes,
    _onBeforeRouteHook: globalContext._onBeforeRouteHook,
    isClientSide: true,
    isPrerendering: false,
    urlOriginal,
    _urlHandler: null,
    _urlRewrite: null,
    _baseServer: baseServer
  }
  const pageContextUrlComputed = getPageContextUrlComputed(pageContextCreated)
  objectAssign(pageContextCreated, pageContextUrlComputed)

  const pageContextAugmented = await createPageContextShared(pageContextCreated, globalContext._pageConfigGlobal)
  augmentType(pageContextCreated, pageContextAugmented)

  return pageContextCreated
}
