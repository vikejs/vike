export { createLoadPageConfig }

import { assertUsage } from '../utils/assert.js'
import { findPageConfig } from '../shared-server-client/page-configs/findPageConfig.js'
import { loadAndParseVirtualFilePageEntry } from '../shared-server-client/page-configs/loadAndParseVirtualFilePageEntry.js'
import { getPublicCopy, resolvePageConfigPublic } from '../shared-server-client/page-configs/resolveVikeConfigPublic.js'
import { parsePageConfigsSerialized } from '../shared-server-client/page-configs/serialize/parsePageConfigsSerialized.js'
import type {
  PageConfigGlobalRuntimeSerialized,
  PageConfigRuntimeSerialized,
} from '../shared-server-client/page-configs/serialize/PageConfigSerialized.js'

type GlobalEntry = {
  pageConfigsSerialized: PageConfigRuntimeSerialized[]
  pageConfigGlobalSerialized: PageConfigGlobalRuntimeSerialized
}

// - `clientRouting`: `true` => every page uses Client Routing, `false` => no page, array => these pages
// - The global entry is loaded only upon loadPageConfig(), so that importing `environmentName` is cheap
// - Not cached in development, so that loadPageConfig() reflects added pages and modified configs
function createLoadPageConfig(
  clientRouting: boolean | string[],
  loadGlobalEntry: (isClientRouting: boolean) => Promise<GlobalEntry>,
  isDev: boolean,
) {
  const pageConfigsPromises = new Map<boolean, Promise<ReturnType<typeof parsePageConfigsSerialized>>>()
  return async function loadPageConfig(pageId: string) {
    const isClientRouting = clientRouting === true || (Array.isArray(clientRouting) && clientRouting.includes(pageId))
    let pageConfigsPromise = pageConfigsPromises.get(isClientRouting)
    if (!pageConfigsPromise) {
      pageConfigsPromise = loadGlobalEntry(isClientRouting).then(
        ({ pageConfigsSerialized, pageConfigGlobalSerialized }) =>
          parsePageConfigsSerialized(pageConfigsSerialized, pageConfigGlobalSerialized),
      )
      if (!isDev) pageConfigsPromises.set(isClientRouting, pageConfigsPromise)
    }
    const { pageConfigs, pageConfigGlobal } = await pageConfigsPromise
    const pageConfig = findPageConfig(pageConfigs, pageId)
    assertUsage(pageConfig, `Unknown page ID ${JSON.stringify(pageId)}`)
    const pageConfigLoaded = await loadAndParseVirtualFilePageEntry(pageConfig, isDev)
    const configInternal = resolvePageConfigPublic({
      pageConfigGlobalValues: pageConfigGlobal.configValues,
      pageConfigValues: pageConfigLoaded.configValues,
    })
    return getPublicCopy(configInternal)
  }
}
