export { createRuntime }

import { assertUsage } from '../utils/assert.js'
import { findPageConfig } from '../shared-server-client/page-configs/findPageConfig.js'
import { loadAndParseVirtualFilePageEntry } from '../shared-server-client/page-configs/loadAndParseVirtualFilePageEntry.js'
import { getPublicCopy, resolvePageConfigPublic } from '../shared-server-client/page-configs/resolveVikeConfigPublic.js'
import { parsePageConfigsSerialized } from '../shared-server-client/page-configs/serialize/parsePageConfigsSerialized.js'
import type {
  PageConfigGlobalRuntimeSerialized,
  PageConfigRuntimeSerialized,
} from '../shared-server-client/page-configs/serialize/PageConfigSerialized.js'

function createRuntime(
  pageConfigsSerialized: PageConfigRuntimeSerialized[],
  pageConfigGlobalSerialized: PageConfigGlobalRuntimeSerialized,
  isDev: boolean,
) {
  const { pageConfigs, pageConfigGlobal } = parsePageConfigsSerialized(
    pageConfigsSerialized,
    pageConfigGlobalSerialized,
  )

  return async function loadPageConfig(pageId: string) {
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
