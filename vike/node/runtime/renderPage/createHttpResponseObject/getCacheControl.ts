export { getCacheControl }

import type { PageConfigRuntime } from '../../../../shared/page-configs/PageConfig.js'
import { getConfigValue, getPageConfig } from '../../../../shared/page-configs/helpers.js'

const defaultValue = 'no-store, max-age=0'

function getCacheControl(pageId: string, pageConfigs: PageConfigRuntime[]): string {
  // TODO/v1-release: remove
  if (pageConfigs.length === 0) return defaultValue

  const pageConfig = getPageConfig(pageId, pageConfigs)
  const configValue = getConfigValue(pageConfig, 'cacheControl', 'string')
  const value = configValue?.value
  if (value) return value

  // - Disabling caching by default is the safest strategy, because caching is problematic with authentication as described in https://github.com/vikejs/vike/issues/1275#issuecomment-1824366875
  // - Are there use cases when we don't need to disable caching?
  //   - When there isn't any <script id="vike_pageContext" type="application/json"> then we can safely have caching. (We don't implement this exception because we're lazy and it's quite a rare situation.)
  return defaultValue
}
