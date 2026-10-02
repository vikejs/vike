export { addPageContextEnvironments }

import type { PageContextConfig } from '../../../shared-server-client/getPageFiles.js'
import { resolvePageContextConfig } from '../../../shared-server-client/page-configs/resolveVikeConfigPublic.js'
import { parsePageConfigsSerialized } from '../../../shared-server-client/page-configs/serialize/parsePageConfigsSerialized.js'
import { findPageConfig } from '../../../shared-server-client/page-configs/findPageConfig.js'
import { loadAndParseVirtualFilePageEntry } from '../../../shared-server-client/page-configs/loadAndParseVirtualFilePageEntry.js'
import { generateVirtualFileIdAdditionalEnvironment } from '../../../shared-server-node/virtualFileId.js'
import { isRunnableDevEnvironment } from '../../../utils/isRunnableDevEnvironment.js'
import { assert, assertUsage } from '../../../utils/assert.js'
import { objectAssign } from '../../../utils/objectAssign.js'
import { getGlobalObject } from '../../../utils/getGlobalObject.js'
import type { GlobalContextServerInternal } from '../globalContext.js'
import type { PageContextPublicMinimum } from '../../../shared-server-client/getPageContextPublicShared.js'
import { getPageContextPublicServer } from './getPageContextPublicServer.js'
import '../../assertEnvServer.js'

type PageConfigs = ReturnType<typeof parsePageConfigsSerialized>
const globalObject = getGlobalObject('renderPageServer/addPageContextEnvironments.ts', {
  pageConfigsByEnvironment: new Map<string, Promise<PageConfigs>>(),
})

// Additional environments (e.g. `rsc`) run in the same runtime as the server environment => their functions can be called directly
// - `pageContext.environments[environmentName]` holds the environment's config values and its view of pageContext, which its functions are called with
async function addPageContextEnvironments(
  pageContextConfig: PageContextConfig,
  pageContext: PageContextPublicMinimum & { pageId: string; _globalContext: GlobalContextServerInternal },
) {
  const environmentEntries = pageContext._globalContext._environmentEntries
  const environments: Record<string, { config: PageContextConfig['config']; pageContext: object }> = {}
  for (const [environmentName, environmentEntry] of Object.entries(environmentEntries)) {
    const pageContextConfigEnv = await loadPageContextConfig(pageContext, environmentName, environmentEntry)
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
  environmentEntry: null | Record<string, unknown>,
) {
  const globalContext = pageContext._globalContext
  const isDev = !globalContext._isProduction
  let pageConfigsPromise = globalObject.pageConfigsByEnvironment.get(environmentName)
  if (!pageConfigsPromise) {
    pageConfigsPromise = importEnvironmentEntry(globalContext, environmentName, environmentEntry).then(
      (environmentEntry: any) =>
        parsePageConfigsSerialized(environmentEntry.pageConfigsSerialized, environmentEntry.pageConfigGlobalSerialized),
    )
    if (!isDev) globalObject.pageConfigsByEnvironment.set(environmentName, pageConfigsPromise)
  }
  const { pageConfigs, pageConfigGlobal } = await pageConfigsPromise
  const pageConfig = findPageConfig(pageConfigs, pageContext.pageId)
  assert(pageConfig)
  return resolvePageContextConfig([], await loadAndParseVirtualFilePageEntry(pageConfig, isDev), pageConfigGlobal)
}

async function importEnvironmentEntry(
  globalContext: GlobalContextServerInternal,
  environmentName: string,
  environmentEntry: null | Record<string, unknown>,
) {
  if (environmentEntry) {
    // Prod
    assert(globalContext._isProduction)
    return environmentEntry
  } else {
    // Dev
    assert(!globalContext._isProduction)
    const environment = globalContext._viteDevServer?.environments[environmentName]
    assertUsage(
      isRunnableDevEnvironment(environment),
      `The Vike environment ${environmentName} should be a server-side environment running in the same runtime (process or worker) as Vike's server`,
    )
    const virtualFileId = generateVirtualFileIdAdditionalEnvironment(environmentName)
    const environmentEntryPromise = environment.runner.import(virtualFileId)
    return environmentEntryPromise
  }
}
