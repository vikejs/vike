// Used by vike:build:pluginProdBuildEntry
export { setGlobalContext_prodBuildEntry } from '../runtime/globalContext.js'

// Used by the vike(app) of the @vikejs/* server adapters
export {
  getMiddlewaresPipe_nonHandlers,
  getMiddlewaresPipe_handlers,
} from '../runtime/universal-middleware/getMiddlewaresPipe.js'

// Used by vike-react-rsc
export { getPageContextJson }

// Used by vite-plugin-vercel
export { route, getPagesAndRoutes }
export type { PageRoutes, PageFile, PageConfigRuntime as PageConfig }

import { route as routeInternal, type PageRoutes } from '../../shared-server-client/route/index.js'
import type { PageFile } from '../../shared-server-client/getPageFiles/getPageFileObject.js'
import { getGlobalContextServerInternal, initGlobalContext_getPagesAndRoutes } from '../runtime/globalContext.js'
import { setNodeEnvProductionIfUndefined } from '../../utils/assertSetup.js'
import { PageConfigRuntime } from '../../types/PageConfig.js'
import type { PageContextServer } from '../../types/PageContext.js'
import { getPageContextJson as getPageContextJsonInternal } from '../runtime/renderPageServer/getPageContextJson.js'
import '../assertEnvServer.js'

/**
 * Used by {@link https://github.com/magne4000/vite-plugin-vercel|vite-plugin-vercel} to compute some rewrite rules and extract { isr } configs.
 *
 * TO-DO/eventually: remove
 */
async function getPagesAndRoutes() {
  setNodeEnvProductionIfUndefined()
  await initGlobalContext_getPagesAndRoutes()
  const { globalContext } = await getGlobalContextServerInternal()
  const {
    //
    _pageRoutes: pageRoutes,
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs,
    _allPageIds: allPageIds,
  } = globalContext
  return {
    pageRoutes,
    pageFilesAll,
    pageConfigs,
    allPageIds,
  }
}

async function route(pageContext: Parameters<typeof routeInternal>[0]) {
  const pageContextFromRoute = await routeInternal(pageContext)
  // Old interface
  return { pageContextAddendum: pageContextFromRoute }
}

function getPageContextJson(pageContext: PageContextServer) {
  // `pageContext` is the public proxy of the internal one
  return getPageContextJsonInternal(pageContext as unknown as Parameters<typeof getPageContextJsonInternal>[0])
}
