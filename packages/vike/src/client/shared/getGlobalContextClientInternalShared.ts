import '../assertEnvClient.js'

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
import { assert, assertUsage } from '../../utils/assert.js'
import { checkType } from '../../utils/checkType.js'
import { genPromise } from '../../utils/genPromise.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { objectAssign } from '../../utils/objectAssign.js'

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

// Return type `never` because it's the type of the server-side getGlobalContext() that is publicly exposed
type TypeIsNotExported = never
async function getGlobalContext(): Promise<TypeIsNotExported> {
  await globalObject.globalContextInitialPromise
  const globalContext = await globalObject.globalContextPromise
  assert(globalContext)
  checkType<GlobalContextNotTyped>(globalContext)
  return globalContext as TypeIsNotExported
}
function getGlobalContextSync(): TypeIsNotExported {
  const { globalContext } = globalObject
  assertUsage(globalContext, getGlobalContextSyncErrMsg)
  checkType<GlobalContextNotTyped>(globalContext)
  return globalContext as TypeIsNotExported
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
