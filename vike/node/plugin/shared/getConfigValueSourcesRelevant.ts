export { getConfigValueSourcesRelevant }

import type { ConfigValueSource, PageConfigBuildTime } from '../../../shared/page-configs/PageConfig.js'
import { assert, assertIsNotBrowser } from '../../shared/utils.js'
assertIsNotBrowser()

function getConfigValueSourcesRelevant(
  pageConfig: PageConfigBuildTime
): (ConfigValueSource & { configName: string })[] {
  const configValueSourcesRelevant = Object.entries(pageConfig.configValueSources).map(([configName, sources]) => {
    const configValueSource = sources[0]
    assert(configValueSource)
    return { configName, ...configValueSource }
  })
  return configValueSourcesRelevant
}
