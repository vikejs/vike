import { determinePageIds } from '../../shared/determinePageIds'
import { getAllPageFiles, loadPageFilesServer } from '../../shared/getPageFiles'
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

type PageFilesServer = { filePath: string; fileExports: { hasExportOnBeforeRender: boolean } }[]
async function retrieveGlobalContext() {
  const globalContext = {
    _parseUrl: null,
    _baseUrl: getBaseUrl(),
    _objectCreatedByVitePluginSsr: true,
  }
  assertBaseUrl(globalContext._baseUrl)

  const allPageFiles = await getAllPageFiles()
  objectAssign(globalContext, { _allPageFiles: allPageFiles })

  const allPageIds = determinePageIds(allPageFiles)
  objectAssign(globalContext, { _allPageIds: allPageIds })

  const [{ pageRoutes, onBeforeRouteHook }, pageFilesServer] = await Promise.all([
    loadPageRoutes(globalContext),
    loadPageFilesServer(allPageFiles),
  ])
  objectAssign(globalContext, {
    _pageRoutes: pageRoutes,
    _onBeforeRouteHook: onBeforeRouteHook,
    _pageFilesServer: pageFilesServer,
  })

  return globalContext
}
