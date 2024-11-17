// Internals needed by vite-plugin-vercel
export { route, getPagesAndRoutes }
export type { PageRoutes, PageFile, PageConfigRuntime as PageConfig }

// Internals needed by nitedani's experimental implementation of vike-telefunc
export { getPageFilesAllSafe }

import { route as routeInternal, type PageRoutes } from '../shared/route/index'
import { getPageFilesAll, type PageFile } from '../shared/getPageFiles'
import { getGlobalContext, initGlobalContext_getGlobalContextAsync } from '../node/runtime/globalContext'
import { handleNodeEnv_vitePluginVercel } from '../utils/assertNodeEnv'
import { getRenderContext } from '../node/runtime/renderPage/renderPageAlreadyRouted'
import { PageConfigRuntime } from '../shared/page-configs/PageConfig'

/**
 * Used by {@link https://github.com/magne4000/vite-plugin-vercel|vite-plugin-vercel}
 * to compute some rewrite rules and extract { isr } configs.
 * Needs `import 'vike/__internal/setup'`
 * @param config
 */
async function getPagesAndRoutes() {
  handleNodeEnv_vitePluginVercel()
  const renderContext = await getRenderContext()
  const {
    //
    pageRoutes,
    pageFilesAll,
    pageConfigs,
    allPageIds
  } = renderContext
  return {
    pageRoutes,
    pageFilesAll,
    pageConfigs,
    allPageIds
  }
}

// TODO: make it cleaner once the internal refactoring about global configs is done.
// Demo usage: https://github.com/vikejs/vike/pull/1823
async function getPageFilesAllSafe(isProduction: boolean) {
  await initGlobalContext_getGlobalContextAsync(isProduction)
  const globalContext = getGlobalContext()
  const pageFilesAll = await getPageFilesAll(false, globalContext.isProduction)
  return pageFilesAll
}

async function route(pageContext: Parameters<typeof routeInternal>[0]) {
  const pageContextFromRoute = await routeInternal(pageContext)
  // Old interface
  return { pageContextAddendum: pageContextFromRoute }
}
