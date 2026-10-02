export { loadPageContextEnvironments }

import type { PageContextConfig } from '../../../shared-server-client/getPageFiles.js'
import { resolvePageContextConfig } from '../../../shared-server-client/page-configs/resolveVikeConfigPublic.js'
import {
  parseGlobalEntryPageConfigs,
  type EnvironmentEntry,
} from '../../../shared-server-client/getPageFiles/parseVirtualFileExportsGlobalEntry.js'
import { findPageConfig } from '../../../shared-server-client/page-configs/findPageConfig.js'
import { loadAndParseVirtualFilePageEntry } from '../../../shared-server-client/page-configs/loadAndParseVirtualFilePageEntry.js'
import { generateVirtualFileIdAdditionalEnvironment } from '../../../shared-server-node/virtualFileId.js'
import { isRunnableDevEnvironment } from '../../../utils/isRunnableDevEnvironment.js'
import { assert, assertUsage } from '../../../utils/assert.js'
import type { GlobalContextServerInternal } from '../globalContext.js'
import type { PageContextPublicMinimum } from '../../../shared-server-client/getPageContextPublicShared.js'
import { getPageContextPublicServer } from './getPageContextPublicServer.js'
import '../../assertEnvServer.js'

// Additional environments (e.g. `rsc`) run in the same runtime as the server environment => their functions can be called directly
// - `pageContext.environments[environmentName]` holds the environment's config values and its view of pageContext, which its functions are called with
async function loadPageContextEnvironments(
  pageContext: PageContextPublicMinimum & { pageId: string; _globalContext: GlobalContextServerInternal },
) {
  const environmentEntries = pageContext._globalContext._environmentEntries
  const environments = Object.fromEntries(
    await Promise.all(
      Object.entries(environmentEntries).map(async ([environmentName, environmentEntry]) => {
        const pageContextConfigEnv = await loadPageContextConfig(pageContext, environmentName, environmentEntry)
        const environment = {
          config: pageContextConfigEnv.config,
          pageContext: getPageContextEnvView(getPageContextPublicServer(pageContext), pageContextConfigEnv),
        }
        return [environmentName, environment] as const
      }),
    ),
  )
  return environments
  /* TODO/ai:
  const pageContextEnvironments = { environments }
  return pageContextEnvironments
  */
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
  environmentEntry: null | EnvironmentEntry,
) {
  const globalContext = pageContext._globalContext
  const { pageConfigs, pageConfigGlobal } = await importEnvironmentEntry(
    globalContext,
    environmentName,
    environmentEntry,
  )
  const pageConfig = findPageConfig(pageConfigs, pageContext.pageId)
  assert(pageConfig)
  const pageConfigLoaded = await loadAndParseVirtualFilePageEntry(pageConfig, !globalContext._isProduction)
  return resolvePageContextConfig([], pageConfigLoaded, pageConfigGlobal)
}

async function importEnvironmentEntry(
  globalContext: GlobalContextServerInternal,
  environmentName: string,
  environmentEntry: null | EnvironmentEntry,
): Promise<EnvironmentEntry> {
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
    return parseGlobalEntryPageConfigs(await environment.runner.import(virtualFileId))
  }
}
