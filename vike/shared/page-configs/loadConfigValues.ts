export { loadConfigValues }

import { objectAssign } from '../utils.js'
import type { PageConfigRuntime, PageConfigRuntimeLoaded } from './PageConfig.js'
import { parseConfigValuesImported } from './serialize/parseConfigValuesImported.js'
import { parseConfigValuesSerialized } from './serialize/parseConfigValuesSerialized.js'

async function loadConfigValues(pageConfig: PageConfigRuntime, isDev: boolean): Promise<PageConfigRuntimeLoaded> {
  if (
    'isAllLoaded' in pageConfig &&
    // We don't need to cache in dev, since Vite already caches the virtual module
    !isDev
  ) {
    return pageConfig as PageConfigRuntimeLoaded
  }
  const configValuesLoaded = await pageConfig.loadConfigValuesAll()
  {
    const { configValuesImported } = configValuesLoaded
    const configValuesAddendum = parseConfigValuesImported(configValuesImported)
    Object.assign(pageConfig.configValues, configValuesAddendum)
  }
  {
    const { configValuesSerialized } = configValuesLoaded
    const configValuesAddendum = parseConfigValuesSerialized(configValuesSerialized)
    Object.assign(pageConfig.configValues, configValuesAddendum)
  }
  objectAssign(pageConfig, { isAllLoaded: true as const })
  return pageConfig
}
