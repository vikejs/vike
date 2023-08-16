export { findPageConfig }

import { assert } from '../utils.js'
import type { PageConfig } from './PageConfig.js'

function findPageConfig(pageConfigs: PageConfig[], pageId: string): null | PageConfig {
  const result = pageConfigs.filter((p) => p.pageId === pageId)
  assert(result.length <= 1)
  const pageConfig = result[0] ?? null
  return pageConfig
}
