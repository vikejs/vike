export { loadConfigValues }

import { objectAssign } from '../utils.js'
import type { PageConfig, PageConfigLoaded } from './PageConfig.js'
import { parseConfigValuesImported } from './parseConfigValuesImported.js'

async function loadConfigValues(pageConfig: PageConfig, isDev: boolean): Promise<PageConfigLoaded> {
  if (
    pageConfig.isLoaded &&
    // We don't need to cache in dev, since Vite already caches the virtual module
    !isDev
  ) {
    return pageConfig as PageConfigLoaded
  }
  const configValuesImported = await pageConfig.loadConfigValuesAll()
  const configValuesAddendum = parseConfigValuesImported(configValuesImported)
  Object.assign(pageConfig.configValues, configValuesAddendum)
  objectAssign(pageConfig, { isLoaded: true as const })
  return pageConfig
}
