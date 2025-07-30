// Public usage
export { getGlobalContext }
export { getGlobalContextSync }

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
      globalContextPromiseResolve,
    }
  })(),
)

function createGetGlobalContextClient<GlobalContextAddendum extends object>(
  virtualFileExports: unknown,
  isClientRouting: boolean,
  addGlobalContext?: (globalContext: GlobalContextBase) => Promise<GlobalContextAddendum>,
) {
  assert(globalObject.isClientRouting === undefined || globalObject.isClientRouting === isClientRouting)
  globalObject.isClientRouting = isClientRouting

  // Eagerly call onCreateGlobalContext() hook
  getGlobalContext()

  return getGlobalContext

  async function getGlobalContext() {
    console.log(
      'globalObject.globalContext?._virtualFileExports === virtualFileExports',
      globalObject.globalContext?._virtualFileExports === virtualFileExports,
    )
    console.log('globalObject.globalContext?._virtualFileExports', globalObject.globalContext?._virtualFileExports)
    console.log('virtualFileExports', virtualFileExports)
    // @ts-ignore
    console.log(
      'virtualFileExports.pageConfigGlobalSerialized.configValuesSerialized',
      virtualFileExports.pageConfigGlobalSerialized.configValuesSerialized,
    )
    // @ts-ignore
    console.log(
      'globalObject.globalContext?._virtualFileExports.pageConfigGlobalSerialized.configValuesSerialized',
      globalObject.globalContext?._virtualFileExports.pageConfigGlobalSerialized.configValuesSerialized,
    )
    console.log('============= 1')
    /*
     */
    /*
     * Module {…}
neverLoaded
: 
(...)
pageConfigGlobalSerialized
: 
Object
configValuesSerialized
: 
onBeforeRoute
: 
definedAtData
: 
{filePathToShowToUser: '/pages/+onBeforeRoute.js', fileExportPathToShowToUser: Array(0)}
type
: 
"standard"
valueSerialized
: 
exportValues
: 
Module
default
: 
ƒ onBeforeRoute(pageContext)
length
: 
1
name
: 
"onBeforeRoute"*/
    // Cache
    if (
      globalObject.globalContext &&
      // Don't break HMR
      globalObject.globalContext._virtualFileExports !== virtualFileExports
    ) {
      return globalObject.globalContext as never
    }

    // Create
    const globalContext = await createGlobalContextShared(
      virtualFileExports,
      globalObject,
      undefined,
      async (globalContext) => {
        const globalContextAddendum = {
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
    assert(globalObject.globalContext)
    globalObject.globalContextPromiseResolve(globalObject.globalContext)
    console.log('============= 3')
    console.log(globalObject.globalContext._onBeforeRouteHook)
    console.log('============= 3')

    // Return
    return globalContext
  }
}

// Type is never exported — it's the server-side getGlobalContext() type that is exported and exposed to the user
type NeverExported = never
async function getGlobalContext(): Promise<NeverExported> {
  const globalContext = await globalObject.globalContextPromise
  return globalContext as never
}
function getGlobalContextSync(): NeverExported {
  const { globalContext } = globalObject
  assertUsage(globalContext, getGlobalContextSyncErrMsg)
  return globalContext as never
}
