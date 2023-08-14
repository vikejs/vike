export { findPageConfig }

import { assert } from '../utils.mjs'
import type { PageConfig } from './PageConfig.mjs'

function findPageConfig(pageConfigs: PageConfig[], pageId: string): null | PageConfig {
  const result = pageConfigs.filter((p) => p.pageId === pageId)
  assert(result.length <= 1)
  const pageConfig = result[0] ?? null
  return pageConfig
}
