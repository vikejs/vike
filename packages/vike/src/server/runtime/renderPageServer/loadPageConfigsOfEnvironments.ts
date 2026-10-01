export { addConfigsOfEnvironments }

import type { PageContextConfig } from '../../../shared-server-client/getPageFiles.js'
import { resolvePageContextConfig } from '../../../shared-server-client/page-configs/resolveVikeConfigPublic.js'
import { parsePageConfigsSerialized } from '../../../shared-server-client/page-configs/serialize/parsePageConfigsSerialized.js'
import { findPageConfig } from '../../../shared-server-client/page-configs/findPageConfig.js'
import { loadAndParseVirtualFilePageEntry } from '../../../shared-server-client/page-configs/loadAndParseVirtualFilePageEntry.js'
import { generateVirtualFileId } from '../../../shared-server-node/virtualFileId.js'
import { isRunnableDevEnvironment } from '../../../utils/isRunnableDevEnvironment.js'
import { assert, assertUsage } from '../../../utils/assert.js'
import { isObject } from '../../../utils/isObject.js'
import { getGlobalObject } from '../../../utils/getGlobalObject.js'
import type { GlobalContextServerInternal } from '../globalContext.js'
import '../../assertEnvServer.js'

type PageConfigs = ReturnType<typeof parsePageConfigsSerialized>
const globalObject = getGlobalObject('renderPageServer/loadPageConfigsOfEnvironments.ts', {
  pageConfigsByEnvironment: new Map<string, Promise<PageConfigs>>(),
})

// Other Vike environments (e.g. `rsc`) run in the same runtime as the server environment => their functions can be called directly
// - A function that only another environment defines is added to `config`: calling it runs it with that environment's view of pageContext
async function addConfigsOfEnvironments(
  pageContextConfig: PageContextConfig,
  pageContext: { pageId: string; _globalContext: GlobalContextServerInternal },
) {
  const { environmentEntries } = pageContext._globalContext._virtualFileExportsGlobalEntry as {
    environmentEntries: Record<string, null | (() => Promise<unknown>)>
  }
  for (const [environmentName, loadEntry] of Object.entries(environmentEntries)) {
    const pageContextConfigEnv = await loadPageContextConfig(pageContext, environmentName, loadEntry)
    Object.entries(pageContextConfigEnv.config).forEach(([configName, value]) => {
      if (configName in pageContextConfig.config || typeof value !== 'function') return
      ;(pageContextConfig.config as Record<string, unknown>)[configName] = (
        pageContextArg: unknown,
        ...args: unknown[]
      ) => {
        assertUsage(
          isObject(pageContextArg),
          `pageContext.config.${configName}() should be called with pageContext as first argument`,
        )
        return value(getPageContextView(pageContextArg, pageContextConfigEnv), ...args)
      }
    })
  }
}

// The same pageContext object, except for the config values (and what's derived from them) which are the environment's
function getPageContextView(pageContext: Record<string, unknown>, pageContextConfig: PageContextConfig) {
  return new Proxy(pageContext, {
    get(target, prop) {
      if (prop === 'Page') return pageContextConfig.exports.Page
      if (prop in pageContextConfig) return pageContextConfig[prop as keyof PageContextConfig]
      return Reflect.get(target, prop)
    },
  })
}

async function loadPageContextConfig(
  pageContext: { pageId: string; _globalContext: GlobalContextServerInternal },
  environmentName: string,
  loadEntry: null | (() => Promise<unknown>),
) {
  const globalContext = pageContext._globalContext
  const isDev = !globalContext._isProduction
  let pageConfigsPromise = globalObject.pageConfigsByEnvironment.get(environmentName)
  if (!pageConfigsPromise) {
    pageConfigsPromise = importGlobalEntry(globalContext, environmentName, loadEntry).then((globalEntry: any) =>
      parsePageConfigsSerialized(globalEntry.pageConfigsSerialized, globalEntry.pageConfigGlobalSerialized),
    )
    if (!isDev) globalObject.pageConfigsByEnvironment.set(environmentName, pageConfigsPromise)
  }
  const { pageConfigs, pageConfigGlobal } = await pageConfigsPromise
  const pageConfig = findPageConfig(pageConfigs, pageContext.pageId)
  assert(pageConfig)
  return resolvePageContextConfig([], await loadAndParseVirtualFilePageEntry(pageConfig, isDev), pageConfigGlobal)
}

async function importGlobalEntry(
  globalContext: GlobalContextServerInternal,
  environmentName: string,
  loadEntry: null | (() => Promise<unknown>),
) {
  if (loadEntry) return loadEntry()
  const environment = globalContext._viteDevServer?.environments[environmentName]
  assertUsage(
    isRunnableDevEnvironment(environment),
    `The Vike environment ${environmentName} should run in the same runtime (process or worker) as Vike's server`,
  )
  return environment.runner.import(generateVirtualFileId({ type: 'global-entry', environmentName }))
}
