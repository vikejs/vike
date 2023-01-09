export { releasePageContext }

import { PageContextRelease, releasePageContextCommon } from '../releasePageContextCommon'
import type { PageContextBuiltInClient } from './types'
import { assert } from './utils'

function releasePageContext<T extends Omit<PageContextBuiltInClient, 'Page'> & PageContextRelease>(pageContext: T) {
  return releasePageContextCommon(pageContext, true)
}
