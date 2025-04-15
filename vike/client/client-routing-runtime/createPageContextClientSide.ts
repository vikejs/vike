export { createPageContextClientSide }

import { createPageContextShared } from '../../shared/createPageContextShared.js'
import { getPageConfigsRuntime } from '../../shared/getPageConfigsRuntime.js'
import { getPageContextUrlComputed } from '../../shared/getPageContextUrlComputed.js'
import { loadPageRoutes } from '../../shared/route/loadPageRoutes.js'
import { getBaseServer } from './getBaseServer.js'
import { getGlobalContext } from './globalContextClientSide.js'
import { assert, augmentType, isBaseServer, objectAssign } from './utils.js'

// @ts-ignore
import * as virtualFileExports from 'virtual:vike:importUserCode:client:client-routing'
const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal } = getPageConfigsRuntime(virtualFileExports)

async function createPageContextClientSide(urlOriginal: string) {
  const { pageRoutes, onBeforeRouteHook } = await loadPageRoutes(
    pageFilesAll,
    pageConfigs,
    pageConfigGlobal,
    allPageIds
  )

  const baseServer = getBaseServer()
  assert(isBaseServer(baseServer))
  const pageContextCreated = {
    isClientSide: true,
    isPrerendering: false,
    urlOriginal,
    globalContext: getGlobalContext(),
    _urlHandler: null,
    _urlRewrite: null,
    _baseServer: baseServer,
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs,
    _pageConfigGlobal: pageConfigGlobal,
    _allPageIds: allPageIds,
    _pageRoutes: pageRoutes,
    _onBeforeRouteHook: onBeforeRouteHook
  }
  const pageContextUrlComputed = getPageContextUrlComputed(pageContextCreated)
  objectAssign(pageContextCreated, pageContextUrlComputed)

  const pageContextAugmented = createPageContextShared(pageContextCreated)
  augmentType(pageContextCreated, pageContextAugmented)

  return pageContextCreated
}
