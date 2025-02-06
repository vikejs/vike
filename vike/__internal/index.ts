// Internals needed by Vike
export { setGlobalContext_buildEntry } from '../node/runtime/globalContext.js'

// Internals needed by vite-plugin-vercel
export { route, getPagesAndRoutes }
export type { PageRoutes, PageFile, PageConfigRuntime as PageConfig }

import { route as routeInternal, type PageRoutes } from '../shared/route/index.js'
import { getPageFilesAll } from '../shared/getPageFiles/getPageFiles.js'
import type { PageFile } from '../shared/getPageFiles/getPageFileObject.js'
import { getGlobalContext, initGlobalContext_getGlobalContextAsync } from '../node/runtime/globalContext.js'
import { setNodeEnvProduction } from '../utils/assertSetup.js'
import { PageConfigRuntime } from '../shared/page-configs/PageConfig.js'

/**
 * Used by {@link https://github.com/magne4000/vite-plugin-vercel|vite-plugin-vercel} to compute some rewrite rules and extract { isr } configs.
 */
async function getPagesAndRoutes() {
  setNodeEnvProduction()
  const globalContext = getGlobalContext()
  const {
    //
    pageRoutes,
    pageFilesAll,
    pageConfigs,
    allPageIds
  } = globalContext
  return {
    pageRoutes,
    pageFilesAll,
    pageConfigs,
    allPageIds
  }
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
