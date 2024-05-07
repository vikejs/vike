export { getConfigValueSourcesNotOverriden }

import type { ConfigValueSource, PageConfigBuildTime } from '../../../shared/page-configs/PageConfig.js'
import { assert, assertIsNotBrowser } from '../../shared/utils.js'
assertIsNotBrowser()

function getConfigValueSourcesNotOverriden(
  pageConfig: PageConfigBuildTime
): (ConfigValueSource & { configName: string })[] {
  const configValueSourcesRelevant = Object.entries(pageConfig.configValueSources).map(([configName, sources]) => {
    assert(sources.length > 0)
    return sources.filter((c) => !c.isOverriden).map((configValueSource) => ({ configName, ...configValueSource }))
  }).flat(1)
  return configValueSourcesRelevant
}
