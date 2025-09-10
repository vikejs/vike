// Public usage
export { getGlobalContext }
export { getGlobalContextSync }
export { setVirtualFileExportsGlobalEntry }

// Internal usage
// TODO/now rename export
// TODO/now rename file
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

async function createGetGlobalContextClient() {
  if (globalObject.globalContextPromise) {
    const globalContext = await globalObject.globalContextPromise
    return globalContext as never
  }

  // Create
  const globalContextPromise = createGlobalContextShared(
    globalObject.virtualFileExportsGlobalEntry,
    globalObject,
    () => {
      const globalContextAddendum = {
        /**
         * Whether the environment is the client-side:
         * - In the browser, the value is `true`.
         * - Upon SSR and pre-rendering, the value is `false`.
         *
         * https://vike.dev/globalContext#isClientSide
         */
        isClientSide: true as const,
      }
      objectAssign(globalContextAddendum, getGlobalContextSerializedInHtml())
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

async function setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry: unknown, isClientRouting: boolean) {
  // TODO/now: remove unused globalObject.isClientRouting
  assert(globalObject.isClientRouting === undefined || globalObject.isClientRouting === isClientRouting)
  globalObject.isClientRouting = isClientRouting
  // HMR => virtualFileExportsGlobalEntry differ
  if (globalObject.virtualFileExportsGlobalEntry !== virtualFileExportsGlobalEntry) {
    delete globalObject.globalContextPromise
    globalObject.virtualFileExportsGlobalEntry = virtualFileExportsGlobalEntry
    // Eagerly call +onCreateGlobalContext() hooks
    await createGetGlobalContextClient()
  }
}
