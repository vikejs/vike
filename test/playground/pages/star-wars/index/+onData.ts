export { onData }

import type { PageContext } from 'vike/types'
import type { Data } from './+data'
import { assert } from '../../../utils/assert'

function onData(pageContext: PageContext & { data: Data }) {
  assert(pageContext.data.title === '6 Star Wars Movies')
  if (pageContext.isClientSide) {
    assert(pageContext.isClientSideNavigation)
    assert(!pageContext.isHydration)
  } else {
    assert(!pageContext.isClientSideNavigation)
  }
}
