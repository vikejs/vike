// Needed by Vike
export { setGlobalContext_buildEntry } from '../node/runtime/globalContext.js'

// Needed by vite-plugin-vercel
export { route, getPagesAndRoutes }
export type { PageRoutes, PageFile, PageConfigRuntime as PageConfig }

import { route as routeInternal, type PageRoutes } from '../shared/route/index.js'
import type { PageFile } from '../shared/getPageFiles/getPageFileObject.js'
import { getGlobalContextServerInternal, initGlobalContext_getPagesAndRoutes } from '../node/runtime/globalContext.js'
import { setNodeEnvProduction } from '../utils/assertSetup.js'
import { PageConfigRuntime } from '../types/PageConfig.js'

/**
 * Used by {@link https://github.com/magne4000/vite-plugin-vercel|vite-plugin-vercel} to compute some rewrite rules and extract { isr } configs.
 *
 * TODO/eventually: remove
 */
async function getPagesAndRoutes() {
  setNodeEnvProduction()
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
