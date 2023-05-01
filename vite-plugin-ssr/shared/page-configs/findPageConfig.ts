export { findPlusConfig }

import { assert } from '../utils'
import type { PlusConfig } from './PlusConfig'

function findPlusConfig(plusConfigs: PlusConfig[], pageId: string): null | PlusConfig {
  const result = plusConfigs.filter((p) => p.pageId === pageId)
  assert(result.length <= 1)
  const plusConfig = result[0] ?? null
  return plusConfig
}
