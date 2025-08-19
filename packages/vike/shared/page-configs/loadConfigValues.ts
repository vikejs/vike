export { loadConfigValues }

import { assert, objectAssign } from '../utils.js'
import type { PageConfigRuntime, PageConfigRuntimeLoaded } from '../../types/PageConfig.js'
import { parseConfigValuesSerialized } from './serialize/parsePageConfigs.js'

async function loadConfigValues(pageConfig: PageConfigRuntime, isDev: boolean): Promise<PageConfigRuntimeLoaded> {
  if (
    'isAllLoaded' in pageConfig &&
    // We don't need to cache in dev, since Vite already caches the virtual module
    !isDev
  ) {
    return pageConfig as PageConfigRuntimeLoaded
  }
  const { moduleId, moduleExports } = pageConfig.loadPageEntry()
  const configValuesLoaded = await moduleExports
  // `configValuesLoaded` is sometimes `undefined` https://github.com/vikejs/vike/discussions/2092
  if (!configValuesLoaded) assert(false, { moduleExports, configValuesLoaded, moduleId })
  const configValues = parseConfigValuesSerialized(configValuesLoaded.configValuesSerialized)
  Object.assign(pageConfig.configValues, configValues)
  objectAssign(pageConfig, { isAllLoaded: true as const })
  return pageConfig
}
