// Internals needed by vite-plugin-vercel
export { route, getPagesAndRoutes }
export type { PageRoutes, PageFile, PageConfigRuntime as PageConfig }

// Internals needed by experimental implementation of vike-telefunc
export { getMiddlewares }

import { route as routeInternal, type PageRoutes } from '../shared/route/index.js'
import { getPageFilesAll, type PageFile } from '../shared/getPageFiles.js'
import { getGlobalContext, initGlobalContext_getGlobalContextAsync } from '../node/runtime/globalContext.js'
import { setNodeEnv_vitePluginVercel } from '../utils/assertUsageNodeEnv.js'
import { getRenderContext } from '../node/runtime/renderPage/renderPageAlreadyRouted.js'
import { PageConfigRuntime } from '../shared/page-configs/PageConfig.js'

/**
 * Used by {@link https://github.com/magne4000/vite-plugin-vercel|vite-plugin-vercel}
 * to compute some rewrite rules and extract { isr } configs.
 * Needs `import 'vike/__internal/setup'`
 * @param config
 */
async function getPagesAndRoutes() {
  setNodeEnv_vitePluginVercel()
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

// TODO/eventually:
//  - Remove the need for `isProduction` after Vike's CLI is implemented
//  - Remove it in favor of https://vike.dev/getGlobalContext
async function getMiddlewares(): Promise<unknown[]> {
  const isProduction = process.env.NODE_ENV === 'production'
  const { pageConfigs } = await getPageFilesAllSafe(isProduction)
  const middlewares: unknown[] = (pageConfigs[0]!.configValues.middleware!.value as any).flat(Infinity)
  return middlewares
}
// TODO/eventually:
//  - Make it cleaner once the internal refactoring about global configs is done.
//  - Remove it in favor of https://vike.dev/getGlobalContext
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
