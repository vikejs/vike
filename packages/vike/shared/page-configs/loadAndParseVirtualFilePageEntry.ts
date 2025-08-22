export { loadAndParseVirtualFilePageEntry }

import { assert, objectAssign } from '../utils.js'
import type {
  ConfigValues,
  PageConfigRuntime,
  PageConfigRuntimeLoaded,
  VirtualFileExportsPageEntry,
} from '../../types/PageConfig.js'
import { parseConfigValuesSerialized } from './serialize/parsePageConfigsSerialized.js'

async function loadAndParseVirtualFilePageEntry(
  pageConfig: PageConfigRuntime,
  isDev: boolean,
): Promise<PageConfigRuntimeLoaded> {
  if (
    'isPageEntryLoaded' in pageConfig &&
    // We don't need to cache in dev, since Vite already caches the virtual module
    !isDev
  ) {
    return pageConfig as PageConfigRuntimeLoaded
  }
  const { moduleId, moduleExportsPromise } = pageConfig.loadVirtualFilePageEntry()
  const virtualFileExportsPageEntry = await moduleExportsPromise
  // `configValuesLoaded` is sometimes `undefined` https://github.com/vikejs/vike/discussions/2092
  if (!virtualFileExportsPageEntry) assert(false, { moduleExportsPromise, virtualFileExportsPageEntry, moduleId })
  const configValues = parseVirtualFileExportsPageEntry(virtualFileExportsPageEntry)
  Object.assign(pageConfig.configValues, configValues)
  objectAssign(pageConfig, { isPageEntryLoaded: true as const })
  return pageConfig
}

function parseVirtualFileExportsPageEntry(virtualFileExportsPageEntry: VirtualFileExportsPageEntry): ConfigValues {
  const configValues = parseConfigValuesSerialized(virtualFileExportsPageEntry.configValuesSerialized)
  return configValues
}
