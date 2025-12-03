// Public usage
export { getGlobalContext }
export { getGlobalContextSync }
export { setVirtualFileExportsGlobalEntry }

// Internal usage
export { getGlobalContextClientInternalShared }
export type GlobalContextClientInternalShared =
  | GlobalContextClientInternal
  | GlobalContextClientInternalWithServerRouting

import {
  createGlobalContextShared,
  getGlobalContextSyncErrMsg,
} from '../../shared-server-client/createGlobalContextShared.js'
import type { GlobalContextClientInternal } from '../runtime-client-routing/getGlobalContextClientInternal.js'
import type { GlobalContextClientInternalWithServerRouting } from '../runtime-server-routing/getGlobalContextClientInternal.js'
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
  'getGlobalContextClientInternalShared.ts',
  (() => {
    const { promise: globalContextInitialPromise, resolve: globalContextInitialPromiseResolve } = genPromise()
    return {
      globalContextInitialPromise,
      globalContextInitialPromiseResolve,
    }
  })(),
)

async function getGlobalContextClientInternalShared() {
  // Get
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

// TODO: rename NeverExported TypeIsNotExported
// TODO: update comment
// TODO: replace never with TypeIsNotExported
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

async function setVirtualFileExportsGlobalEntry(virtualFileExportsGlobalEntry: unknown) {
  // HMR => virtualFileExportsGlobalEntry differ
  if (globalObject.virtualFileExportsGlobalEntry !== virtualFileExportsGlobalEntry) {
    delete globalObject.globalContextPromise
    globalObject.virtualFileExportsGlobalEntry = virtualFileExportsGlobalEntry
    // Eagerly call +onCreateGlobalContext() hooks
    await getGlobalContextClientInternalShared()
  }
}
