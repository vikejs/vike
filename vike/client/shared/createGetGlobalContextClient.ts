// Public usage
export { getGlobalContext }
export { getGlobalContextSync }

// Internal usage
export { createGetGlobalContextClient }

import {
  createGlobalContextShared,
  getGlobalContextSyncErrMsg,
  type GlobalContextShared
} from '../../shared/createGlobalContextShared.js'
import { getGlobalContextSerializedInHtml } from './getJsonSerializedInHtml.js'
import { assert, assertUsage, genPromise, getGlobalObject, objectAssign } from './utils.js'

type GlobalContextNotTyped = Record<string, unknown>
const globalObject = getGlobalObject<{
  globalContext?: GlobalContextNotTyped
  isClientRouting?: boolean
  globalContextPromise: Promise<GlobalContextNotTyped>
  globalContextPromiseResolve: (globalContext: GlobalContextNotTyped) => void
}>(
  'createGetGlobalContextClient.ts',
  (() => {
    const { promise: globalContextPromise, resolve: globalContextPromiseResolve } = genPromise<GlobalContextNotTyped>()
    return {
      globalContextPromise,
      globalContextPromiseResolve
    }
  })()
)

function createGetGlobalContextClient<GlobalContextAddendum extends object>(
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
    const globalContext = await createGlobalContextShared(virtualFileExports, globalObject, async (globalContext) => {
      const globalContextAddendum = {
        /**
         * Whether the environment is client-side or server-side / pre-rendering.
         *
         * We recommend using `import.meta.env.SSR` instead, see https://vike.dev/globalContext
         */
        isClientSide: true as const
      }
      objectAssign(globalContextAddendum, getGlobalContextSerializedInHtml())
      objectAssign(globalContextAddendum, await addGlobalContext?.(globalContext))
      return globalContextAddendum
    })
    assert(globalObject.globalContext)
    globalObject.globalContextPromiseResolve(globalObject.globalContext)

    // Return
    return globalContext
  }
}

async function getGlobalContext() {
  return globalObject.globalContextPromise
}
function getGlobalContextSync() {
  const { globalContext } = globalObject
  assertUsage(globalContext, getGlobalContextSyncErrMsg)
  return globalContext
}
