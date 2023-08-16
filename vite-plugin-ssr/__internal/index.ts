// Internal functions of vps needed by other plugins are exported via this file

import { route, type PageRoutes } from '../shared/route/index.js'
import { type PageFile } from '../shared/getPageFiles.js'
import { getGlobalContext, initGlobalContext } from '../node/runtime/globalContext.js'
import { setNodeEnvToProduction } from '../utils/nodeEnv.js'
import { assert } from '../utils/assert.js'
import { getRenderContext } from '../node/runtime/renderPage/renderPageAlreadyRouted.js'

export { route, getPagesAndRoutes }
export type { PageRoutes, PageFile }

/**
 * Used by {@link https://github.com/magne4000/vite-plugin-vercel|vite-plugin-vercel}
 * to compute some rewrite rules and extract { isr } configs.
 * Needs `import 'vite-plugin-ssr/__internal/setup'`
 * @param config
 */
async function getPagesAndRoutes() {
  setNodeEnvToProduction()

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
