// Internal functions of vps needed by other plugins are exported via this file

import { loadPageRoutes, PageRoutes, route } from '../shared/route'
import { getPageFilesAll, PageFile } from '../shared/getPageFiles'
import { getGlobalContext } from '../node/globalContext'
import { setProductionEnvVar } from '../shared/setProduction'

export { route, getPagesAndRoutes }
export type { PageRoutes, PageFile }

/**
 * Used by {@link https://github.com/magne4000/vite-plugin-vercel|vite-plugin-vercel}
 * to compute some rewrite rules and extract { isr } configs.
 * Needs `import 'vite-plugin-ssr/__internal/setup'`
 * @param config
 */
async function getPagesAndRoutes() {
  setProductionEnvVar()
  await getGlobalContext(true)

  const { pageFilesAll, allPageIds } = await getPageFilesAll(false, true)

  const { pageRoutes } = await loadPageRoutes({
    _pageFilesAll: pageFilesAll,
    _allPageIds: allPageIds
  })

  return {
    pageRoutes,
    pageFilesAll,
    allPageIds
  }
}
