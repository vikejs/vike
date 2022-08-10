export { releasePageContext }

import { PageContextRelease, releasePageContextCommon } from '../releasePageContextCommon'
import type { PageContextBuiltInClient } from './types'
import { assert } from './utils'

function releasePageContext<T extends Omit<PageContextBuiltInClient, 'Page'> & PageContextRelease>(pageContext: T) {
  assert([true, false].includes(pageContext.isHydration))
  assert([true, false, null].includes(pageContext.isBackwardNavigation))
  return releasePageContextCommon(pageContext)
}
