export { createGetGlobalContext }

import { getPageConfigsRuntime } from '../../shared/getPageConfigsRuntime.js'
import { assert, getGlobalObject, objectAssign, objectReplace } from './utils.js'

const globalObject = getGlobalObject<{
  globalContext?: Record<string, unknown>
  isClientRouting?: boolean
}>('createGetGlobalContext.ts', {})

function createGetGlobalContext<GlobalContextAddendum extends object>(
  virtualFileExports: unknown,
  isClientRouting: boolean,
  addGlobalContext?: (globalContext: GlobalContextBase) => Promise<GlobalContextAddendum>
) {
  assert(globalObject.isClientRouting === undefined || globalObject.isClientRouting === isClientRouting)
  globalObject.isClientRouting = isClientRouting

  // Eagerly call onCreateGlobalContext() hook
  getGlobalContext()

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
    const globalContext = await createGlobalContext<GlobalContextAddendum>(virtualFileExports, addGlobalContext)

    // Singleton
    if (!globalObject.globalContext) {
      globalObject.globalContext = globalContext
    } else {
      // Ensure all `globalContext` user-land references are preserved & updated
      objectReplace(globalObject.globalContext, globalContext)
    }

    // Return
    return globalContext
  }
}

async function createGlobalContext<GlobalContextAddendum extends object>(
  virtualFileExports: unknown,
  addGlobalContext?: (globalContext: GlobalContextBase) => Promise<GlobalContextAddendum>
) {
  const globalContext = await createGlobalContextBase(virtualFileExports)
  const globalContextAddendum = await addGlobalContext?.(globalContext)
  objectAssign(globalContext, globalContextAddendum)
  return globalContext
}

type GlobalContextBase = Awaited<ReturnType<typeof createGlobalContextBase>>
async function createGlobalContextBase(virtualFileExports: unknown) {
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
