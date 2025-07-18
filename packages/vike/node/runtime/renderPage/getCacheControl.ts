export { getCacheControl }
export { cacheControlDisable }

import type { PageConfigRuntime } from '../../../types/PageConfig.js'
import { getPageConfig } from '../../../shared/page-configs/helpers.js'
import { getConfigValueRuntime } from '../../../shared/page-configs/getConfigValueRuntime.js'

const cacheControlDisable = 'no-store, max-age=0'

function getCacheControl(pageId: string | null, pageConfigs: PageConfigRuntime[]): string {
  // TO-DO/next-major-release: remove this line
  if (pageConfigs.length === 0) return cacheControlDisable

  if (pageId) {
    const pageConfig = getPageConfig(pageId, pageConfigs)
    const configValue = getConfigValueRuntime(pageConfig, 'cacheControl', 'string')
    const value = configValue?.value
    if (value) return value
  }

  // - Disabling caching by default is the safest strategy, because caching is problematic with authentication as described in https://github.com/vikejs/vike/issues/1275#issuecomment-1824366875
  // - Are there use cases when we don't need to disable caching?
  //   - When there isn't any <script id="vike_pageContext" type="application/json"> then we can safely have caching. (We don't implement this exception because we're lazy and it's quite a rare situation.)
  return cacheControlDisable
}
