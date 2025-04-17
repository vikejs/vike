export { createGlobalContextShared }
export type { GlobalContextShared }

import { getPageConfigsRuntime } from './getPageConfigsRuntime.js'
import { objectAssign } from './utils.js'

async function createGlobalContextShared<GlobalContextAddendum extends object>(
  virtualFileExports: unknown,
  addGlobalContext?: (globalContext: GlobalContextShared) => Promise<GlobalContextAddendum>
) {
  const globalContext = await createGlobalContextBase(virtualFileExports)
  const globalContextAddendum = await addGlobalContext?.(globalContext)
  objectAssign(globalContext, globalContextAddendum)
  return globalContext
}

type GlobalContextShared = Awaited<ReturnType<typeof createGlobalContextBase>>
async function createGlobalContextBase(virtualFileExports: unknown) {
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
