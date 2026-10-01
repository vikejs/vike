// Used by vike:build:pluginProdBuildEntry
export { setGlobalContext_prodBuildEntry } from '../runtime/globalContext.js'

// Used by vike:pluginUniversalDeploy
export { withMiddlewares }

// Used by vite-plugin-vercel
export { route, getPagesAndRoutes }
export type { PageRoutes, PageFile, PageConfigRuntime as PageConfig }

import { route as routeInternal, type PageRoutes } from '../../shared-server-client/route/index.js'
import type { PageFile } from '../../shared-server-client/getPageFiles/getPageFileObject.js'
import { getGlobalContextServerInternal, initGlobalContext_getPagesAndRoutes } from '../runtime/globalContext.js'
import { setNodeEnvProductionIfUndefined } from '../../utils/assertSetup.js'
import { PageConfigRuntime } from '../../types/PageConfig.js'
import type { Server } from '../../types/Server.js'
import { universalMiddlewares } from '../runtime/getUniversalMiddlewares.js'
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

// Applies +middleware before the +server handler
function withMiddlewares(server: Server): Server {
  const { fetch } = server
  return {
    ...server,
    async fetch(request, ...args: unknown[]) {
      const result = await universalMiddlewares(request)
      if (result instanceof Response) return result
      const response: Response = await Reflect.apply(fetch, server, [request, ...args])
      return result ? result(response) : response
    },
  }
}
