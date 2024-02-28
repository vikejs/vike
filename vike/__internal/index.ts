// Internals needed by vite-plugin-vercel
export { route, getPagesAndRoutes }
export type { PageRoutes, PageFile, PageConfigRuntime as PageConfig }

import { route as routeInternal, type PageRoutes } from '../shared/route/index.js'
import { type PageFile } from '../shared/getPageFiles.js'
import { getGlobalContext, initGlobalContext } from '../node/runtime/globalContext.js'
import { handleNodeEnv_vitePluginVercel } from '../utils/assertNodeEnv.js'
import { assert } from '../utils/assert.js'
import { getRenderContext } from '../node/runtime/renderPage/renderPageAlreadyRouted.js'
import { PageConfigRuntime } from '../shared/page-configs/PageConfig.js'

/**
 * Used by {@link https://github.com/magne4000/vite-plugin-vercel|vite-plugin-vercel}
 * to compute some rewrite rules and extract { isr } configs.
 * Needs `import 'vike/__internal/setup'`
 * @param config
 */
async function getPagesAndRoutes() {
  handleNodeEnv_vitePluginVercel()

  await initGlobalContext(true)
  const globalContext = getGlobalContext()
  assert(globalContext.isProduction === true)

  const renderContext = await getRenderContext()
  const { pageFilesAll, pageConfigs, allPageIds, pageRoutes } = renderContext

  return {
    pageRoutes,
    pageFilesAll,
    pageConfigs,
    allPageIds
  }
}

async function route(pageContext: Parameters<typeof routeInternal>[0]) {
  const pageContextFromRoute = await routeInternal(pageContext)
  // Old interface
  return { pageContextAddendum: pageContextFromRoute }
}
