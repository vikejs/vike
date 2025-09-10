// Public usage
export { getGlobalContext }
export { getGlobalContextSync }
export { setVirtualFileExportsGlobalEntry }

// Internal usage
export { createGetGlobalContextClient }
export type GlobalContextClientInternalShared =
  | GlobalContextClientInternal
  | GlobalContextClientInternalWithServerRouting

import {
  createGlobalContextShared,
  getGlobalContextSyncErrMsg,
  type GlobalContextBase,
} from '../../shared/createGlobalContextShared.js'
import type { GlobalContextClientInternal } from '../runtime-client-routing/globalContext.js'
import type { GlobalContextClientInternalWithServerRouting } from '../runtime-server-routing/globalContext.js'
import { getGlobalContextSerializedInHtml } from './getJsonSerializedInHtml.js'
import { assert, assertUsage, genPromise, getGlobalObject, objectAssign, checkType } from './utils.js'

type GlobalContextNotTyped = Record<string, unknown>
const globalObject = getGlobalObject<{
  isClientRouting?: boolean
  virtualFileExportsGlobalEntry?: unknown
  globalContext?: GlobalContextNotTyped
  globalContextPromise?: Promise<GlobalContextNotTyped>
  globalContextInitialPromise: Promise<void>
  globalContextInitialPromiseResolve: () => void
}>(
  'createGetGlobalContextClient.ts',
  (() => {
    const { promise: globalContextInitialPromise, resolve: globalContextInitialPromiseResolve } = genPromise()
    return {
      globalContextInitialPromise,
      globalContextInitialPromiseResolve,
    }
  })(),
)

function createGetGlobalContextClient<GlobalContextAddendum extends object>(
  addGlobalContext?: (globalContext: GlobalContextBase) => Promise<GlobalContextAddendum>,
) {
  return getGlobalContext

  async function getGlobalContext() {
    if (globalObject.globalContextPromise) {
      const globalContext = await globalObject.globalContextPromise
      return globalContext as never
    }

    // Create
    const globalContextPromise = createGlobalContextShared(
      globalObject.virtualFileExportsGlobalEntry,
      globalObject,
      undefined,
      async (globalContext) => {
        const globalContextAddendum = {
          // TODO/now update JSDocs
          /**
           * Whether the environment is client-side or server-side / pre-rendering.
           *
           * We recommend using `import.meta.env.SSR` instead, see https://vike.dev/globalContext
           */
          isClientSide: true as const,
        }
        objectAssign(globalContextAddendum, getGlobalContextSerializedInHtml())
        objectAssign(globalContextAddendum, await addGlobalContext?.(globalContext))
        return globalContextAddendum
      },
    )
    globalObject.globalContextPromise = globalContextPromise
    const globalContext = await globalContextPromise
    assert(globalObject.globalContext === globalContext)
    globalObject.globalContextInitialPromiseResolve()

    // Return
    return globalContext
  }
}

// Type is never exported — it's the server-side getGlobalContext() type that is exported and exposed to the user
type NeverExported = never
async function getGlobalContext(): Promise<NeverExported> {
  await globalObject.globalContextInitialPromise
  const globalContext = await globalObject.globalContextPromise
  assert(globalContext)
  checkType<GlobalContextNotTyped>(globalContext)
  return globalContext as never
}
function getGlobalContextSync(): NeverExported {
  const { globalContext } = globalObject
  assertUsage(globalContext, getGlobalContextSyncErrMsg)
  checkType<GlobalContextNotTyped>(globalContext)
  return globalContext as never
}

function setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry: unknown, isClientRouting: boolean) {
  // TODO/now: remove unused globalObject.isClientRouting
  assert(globalObject.isClientRouting === undefined || globalObject.isClientRouting === isClientRouting)
  globalObject.isClientRouting = isClientRouting
  // HMR => virtualFileExportsGlobalEntry differ
  if (globalObject.virtualFileExportsGlobalEntry !== virtualFileExportsGlobalEntry) {
    delete globalObject.globalContextPromise
    globalObject.virtualFileExportsGlobalEntry = virtualFileExportsGlobalEntry
    // TODO/now: refactor to make it work
    // Eagerly call +onCreateGlobalContext() hooks
    getGlobalContext()
  }
}
