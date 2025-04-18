export { createGlobalContextShared }
export type { GlobalContextShared }
export type { GlobalContextSharedPublic }

import { getPageConfigsRuntime } from './getPageConfigsRuntime.js'
import { executeHookGenericGlobalCumulative } from './hooks/executeHookGeneric.js'
import { objectAssign } from './utils.js'

async function createGlobalContextShared<GlobalContextAddendum extends object>(
  virtualFileExports: unknown,
  globalObject: { globalContext?: Record<string, unknown> },
  addGlobalContext?: (globalContext: GlobalContextShared) => Promise<GlobalContextAddendum>
) {
  const globalContext = createGlobalContextBase(virtualFileExports)

  const globalContextAddendum = await addGlobalContext?.(globalContext)
  objectAssign(globalContext, globalContextAddendum)

  if (!globalObject.globalContext) {
    globalObject.globalContext = globalContext

    // - We deliberately call onCreateGlobalContext() only at the beginning and only once per process.
    // - TO-DO/eventually: HMR
    //    - Once Photon supports it: `server.hot.send({ type: 'full-server-reload' })`
    //    - Either use:
    //      - import.meta.hot
    //        - https://vite.dev/guide/api-hmr.html
    //        - Use a Vite transformer to inject import.meta.hot code into each user-land `+onCreateGlobalContext.js` file
    //        - Seems more idiomatic
    //      - globalContext._viteDevServer.hot.send()
    //        - Send 'full-server-reload' signal whenever a onCreateGlobalContext() function is modified => we need a globalObject to track all hooks and see if one of them is new/modified.
    //        - Seems less idiomatic
    await executeHookGenericGlobalCumulative(
      'onCreateGlobalContext',
      globalContext._pageConfigGlobal,
      null,
      globalContext
    )
  } else {
    // Singleton: ensure all `globalContext` user-land references are preserved & updated.
    // We don't use objectReplace() in order to keep user-land properties.
    objectAssign(globalObject.globalContext, globalContext)
  }

  return globalContext
}

type GlobalContextSharedPublic = Pick<GlobalContextShared, 'config' | 'pages'>
type GlobalContextShared = ReturnType<typeof createGlobalContextBase>
function createGlobalContextBase(virtualFileExports: unknown) {
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
