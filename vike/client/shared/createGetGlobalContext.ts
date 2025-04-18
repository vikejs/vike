export { createGetGlobalContext }

import { createGlobalContextShared, type GlobalContextShared } from '../../shared/createGlobalContextShared.js'
import { assert, getGlobalObject } from './utils.js'

const globalObject = getGlobalObject<{
  globalContext?: Record<string, unknown>
  isClientRouting?: boolean
}>('createGetGlobalContext.ts', {})

function createGetGlobalContext<GlobalContextAddendum extends object>(
  virtualFileExports: unknown,
  isClientRouting: boolean,
  addGlobalContext?: (globalContext: GlobalContextShared) => Promise<GlobalContextAddendum>
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
    const globalContext = await createGlobalContextShared(virtualFileExports, globalObject, addGlobalContext)

    // Return
    return globalContext
  }
}
