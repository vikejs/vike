export { createGetGlobalContext }

import { getPageConfigsRuntime } from '../../shared/getPageConfigsRuntime.js'
import { assert, getGlobalObject, objectAssign, objectReplace } from './utils.js'

// TODO/now: eager call

const globalObject = getGlobalObject<{
  globalContext?: Record<string, unknown>
  isClientRouting?: boolean
}>('createGetGlobalContext.ts', {})

function createGetGlobalContext<GlobalContextAddendum extends object>(
  virtualFileExports: unknown,
  isClientRouting: boolean,
  addGlobalContext?: (globalContext: ReturnType<typeof createGlobalContext>) => Promise<GlobalContextAddendum>
) {
  assert(globalObject.isClientRouting === undefined || globalObject.isClientRouting === isClientRouting)
  globalObject.isClientRouting = isClientRouting

  return getGlobalContext

  async function getGlobalContext() {
    // Cache
    if (
      globalObject.globalContext &&
      // Don't break HMR
      globalObject.globalContext._virtualFileExports !== virtualFileExports
    ) {
      return globalObject.globalContext as never
    }

    // Create
    const globalContext = createGlobalContext(virtualFileExports)
    const globalContextAddendum = await addGlobalContext?.(globalContext)
    objectAssign(globalContext, globalContextAddendum)

    // Singleton
    if (!globalObject.globalContext) {
      globalObject.globalContext = globalContext
    } else {
      // Ensure all `globalContext` references are preserved & updated
      objectReplace(globalObject.globalContext, globalContext)
    }

    // Return
    return globalContext
  }
}

function createGlobalContext(virtualFileExports: unknown) {
  const { pageFilesAll, allPageIds, pageConfigs, pageConfigGlobal } = getPageConfigsRuntime(virtualFileExports)
  const globalContext = {
    _virtualFileExports: virtualFileExports,
    _pageFilesAll: pageFilesAll,
    _pageConfigs: pageConfigs,
    _pageConfigGlobal: pageConfigGlobal,
    _allPageIds: allPageIds
  }
  return globalContext
}
