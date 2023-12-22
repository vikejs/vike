export { getCacheControl }

import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig.js'
import { assert } from '../utils.js'

function getCacheControl(pageId: string, pageConfigs: PageConfigRuntime[]): string {
  if (pageConfigs.length > 0) {
    const pageConfig = pageConfigs.find((p) => p.pageId === pageId)
    assert(pageConfig)
    if (pageConfig.configValues.cacheControl) {
      assert(typeof pageConfig.configValues.cacheControl.value === 'string')
      return pageConfig.configValues.cacheControl.value
    }
  }

  // Disable caching by default, see https://github.com/vikejs/vike/issues/1275
  return 'no-store, max-age=0'
}
