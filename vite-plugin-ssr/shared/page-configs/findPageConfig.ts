export { findPageConfig }

import { assert } from '../utils'
import type { PageConfig } from './PageConfig'

function findPageConfig(pageConfigs: PageConfig[], pageId: string): null | PageConfig {
  const result = pageConfigs.filter((p) => p.pageId === pageId)
  assert(result.length <= 1)
  const pageConfig = result[0] ?? null
  return pageConfig
}
