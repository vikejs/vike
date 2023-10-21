export { loadConfigValues }

import { objectAssign } from '../utils.js'
import type { PageConfigRuntime, PageConfigRuntimeLoaded } from './PageConfig.js'
import { parseConfigValuesImported } from './serialize/parseConfigValuesImported.js'

async function loadConfigValues(pageConfig: PageConfigRuntime, isDev: boolean): Promise<PageConfigRuntimeLoaded> {
  if (
    'isLoaded' in pageConfig &&
    // We don't need to cache in dev, since Vite already caches the virtual module
    !isDev
  ) {
    return pageConfig as PageConfigRuntimeLoaded
  }
  const configValuesImported = await pageConfig.loadConfigValuesAll()
  const configValuesAddendum = parseConfigValuesImported(configValuesImported)
  Object.assign(pageConfig.configValues, configValuesAddendum)
  objectAssign(pageConfig, { isLoaded: true as const })
  return pageConfig
}
