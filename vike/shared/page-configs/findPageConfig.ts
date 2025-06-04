export { findPageConfig }

import { assert } from '../utils.js'
import type { PageConfigRuntime } from '../../types/PageConfig.js'

function findPageConfig(pageConfigs: PageConfigRuntime[], pageId: string): null | PageConfigRuntime {
  const result = pageConfigs.filter((p) => p.pageId === pageId)
  assert(result.length <= 1)
  const pageConfig = result[0] ?? null
  return pageConfig
}
