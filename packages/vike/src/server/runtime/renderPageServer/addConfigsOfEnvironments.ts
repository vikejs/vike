export { addConfigsOfEnvironments }

import type { PageContextConfig } from '../../../shared-server-client/getPageFiles.js'
import { resolvePageContextConfig } from '../../../shared-server-client/page-configs/resolveVikeConfigPublic.js'
import { parsePageConfigsSerialized } from '../../../shared-server-client/page-configs/serialize/parsePageConfigsSerialized.js'
import { findPageConfig } from '../../../shared-server-client/page-configs/findPageConfig.js'
import { loadAndParseVirtualFilePageEntry } from '../../../shared-server-client/page-configs/loadAndParseVirtualFilePageEntry.js'
import { generateVirtualFileId } from '../../../shared-server-node/virtualFileId.js'
import { isRunnableDevEnvironment } from '../../../utils/isRunnableDevEnvironment.js'
import { assert, assertUsage } from '../../../utils/assert.js'
import { objectAssign } from '../../../utils/objectAssign.js'
import { getGlobalObject } from '../../../utils/getGlobalObject.js'
import type { GlobalContextServerInternal } from '../globalContext.js'
import type { PageContextPublicMinimum } from '../../../shared-server-client/getPageContextPublicShared.js'
import { getPageContextPublicServer } from './getPageContextPublicServer.js'
import '../../assertEnvServer.js'

type PageConfigs = ReturnType<typeof parsePageConfigsSerialized>
const globalObject = getGlobalObject('renderPageServer/addConfigsOfEnvironments.ts', {
  pageConfigsByEnvironment: new Map<string, Promise<PageConfigs>>(),
})

// Other Vike environments (e.g. `rsc`) run in the same runtime as the server environment => their functions can be called directly
// - `pageContext.environments[environmentName]` holds the environment's config values and its view of pageContext, which its functions are called with
async function addConfigsOfEnvironments(
  pageContextConfig: PageContextConfig,
  pageContext: PageContextPublicMinimum & { pageId: string; _globalContext: GlobalContextServerInternal },
) {
  const { environmentEntries } = pageContext._globalContext._virtualFileExportsGlobalEntry as {
    environmentEntries: Record<string, null | (() => Promise<unknown>)>
  }
  const environments: Record<string, { config: PageContextConfig['config']; pageContext: object }> = {}
  for (const [environmentName, loadEntry] of Object.entries(environmentEntries)) {
    const pageContextConfigEnv = await loadPageContextConfig(pageContext, environmentName, loadEntry)
    environments[environmentName] = {
      config: pageContextConfigEnv.config,
      pageContext: getPageContextEnvView(getPageContextPublicServer(pageContext), pageContextConfigEnv),
    }
  }
  objectAssign(pageContextConfig, { environments })
}

// The same pageContext object, except for the config values (and what's derived from them) which are the environment's
function getPageContextEnvView(pageContext: object, pageContextConfig: PageContextConfig) {
  // TO-DO/soon/flat-pageContext make this clean using same mechanism as [Flat `pageContext`](https://github.com/vikejs/vike/issues/1268)
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
    `The Vike environment ${environmentName} should be a server-side environment running in the same runtime (process or worker) as Vike's server`,
  )
  return environment.runner.import(generateVirtualFileId({ type: 'global-entry', environmentName }))
}
