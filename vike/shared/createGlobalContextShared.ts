export { createGlobalContextShared }
export type { GlobalContextShared }
export type { GlobalContextSharedPublic }

import { objectReplace } from '../utils/objectReplace.js'
import { getPageConfigsRuntime } from './getPageConfigsRuntime.js'
import { objectAssign } from './utils.js'

async function createGlobalContextShared<GlobalContextAddendum extends object>(
  virtualFileExports: unknown,
  //globalObject: { globalContext?: Record<string, unknown> },
  globalObject: Record<string, unknown>,
  addGlobalContext?: (globalContext: GlobalContextShared) => Promise<GlobalContextAddendum>
) {
  const globalContext = createGlobalContextBase(virtualFileExports)

  const globalContextAddendum = await addGlobalContext?.(globalContext)
  objectAssign(globalContext, globalContextAddendum)

  // Singleton
  if (!globalObject.globalContext) {
    globalObject.globalContext = globalContext
  } else {
    // Ensure all `globalContext` user-land references are preserved & updated
    objectReplace(globalObject.globalContext, globalContext)
  }

  return globalContext
}

type GlobalContextSharedPublic = Pick<GlobalContextShared, 'config' | 'pages'>
type GlobalContextShared = ReturnType<typeof createGlobalContextBase>
function createGlobalContextBase(virtualFileExports: unknown) {
  const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal, globalConfig, pageConfigsUserFriendly } =
    getPageConfigsRuntime(virtualFileExports)
  const globalContext = {
    _virtualFileExports: virtualFileExports,
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs,
    _pageConfigGlobal: pageConfigGlobal,
    _allPageIds: allPageIds,
    config: globalConfig.config,
    pages: pageConfigsUserFriendly
  }
  return globalContext
}
