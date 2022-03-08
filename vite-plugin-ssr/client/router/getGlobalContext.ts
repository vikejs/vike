import { loadPageFilesServerMeta, getPageIds } from '../../shared/getPageFiles'
import { loadPageRoutes } from '../../shared/route'
import { assertBaseUrl, objectAssign, PromiseType, getBaseUrl } from './utils'

export { getGlobalContext }
export type { PageFilesServer }

let globalContext: PromiseType<ReturnType<typeof retrieveGlobalContext>>

async function getGlobalContext() {
  if (!globalContext) {
    globalContext = await retrieveGlobalContext()
  }
  return globalContext
}

type PageFilesServer = { filePath: string; fileExports: { hasExport_onBeforeRender: boolean } }[]
async function retrieveGlobalContext() {
  const globalContext = {
    _parseUrl: null,
    _baseUrl: getBaseUrl(),
    _objectCreatedByVitePluginSsr: true,
    // @ts-ignore
    _isProduction: import.meta.env.PROD,
  }
  assertBaseUrl(globalContext._baseUrl)

  const allPageIds = determinePageIds(allPageFiles)
  objectAssign(globalContext, { _allPageIds: allPageIds })

  const [{ pageRoutes, onBeforeRouteHook }, pageFilesServerAll] = await Promise.all([
    loadPageRoutes(globalContext),
    loadPageFilesServerAll(allPageFiles),
  ])
  objectAssign(globalContext, {
    _pageRoutes: pageRoutes,
    _onBeforeRouteHook: onBeforeRouteHook,
    _pageFilesServerMeta: pageFilesServerAll,
  })

  return globalContext
}
