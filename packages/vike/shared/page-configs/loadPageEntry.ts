export { loadPageEntry }

import { assert, objectAssign } from '../utils.js'
import type { PageConfigRuntime, PageConfigRuntimeLoaded } from '../../types/PageConfig.js'
import { parseConfigValuesSerialized } from './serialize/parsePageConfigs.js'

async function loadPageEntry(pageConfig: PageConfigRuntime, isDev: boolean): Promise<PageConfigRuntimeLoaded> {
  if (
    'isPageEntryLoaded' in pageConfig &&
    // We don't need to cache in dev, since Vite already caches the virtual module
    !isDev
  ) {
    return pageConfig as PageConfigRuntimeLoaded
  }
  const { moduleId, moduleExportsPromise } = pageConfig.loadVirtualFilePageEntry()
  const moduleExports = await moduleExportsPromise
  // `configValuesLoaded` is sometimes `undefined` https://github.com/vikejs/vike/discussions/2092
  if (!moduleExports) assert(false, { moduleExportsPromise, moduleExports, moduleId })
  const configValues = parseConfigValuesSerialized(moduleExports.configValuesSerialized)
  Object.assign(pageConfig.configValues, configValues)
  objectAssign(pageConfig, { isPageEntryLoaded: true as const })
  return pageConfig
}
