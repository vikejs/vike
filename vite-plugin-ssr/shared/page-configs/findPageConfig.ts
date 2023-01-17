export { findPageConfig }

import { assert } from '../utils'
import type { PageConfig2 } from './PageConfig'

function findPageConfig(pageConfigs: PageConfig2[], pageId2: string): null | PageConfig2 {
  const result = pageConfigs.filter((p) => p.pageId2 === pageId2)
  assert(result.length <= 1)
  const pageConfig = result[0] ?? null
  return pageConfig
}
