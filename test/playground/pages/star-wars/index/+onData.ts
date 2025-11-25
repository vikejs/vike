export { onData }

import type { PageContext } from 'vike/types'
import type { Data } from './+data'
import { assert } from '../../../utils/assert'

function onData(pageContext: PageContext & { data: Data }) {
  assert(pageContext.data.title === '6 Star Wars Movies')
  if (pageContext.isClientSide) {
    assert(pageContext.isHydration === false)
    if (pageContext.pageContextsAborted.length === 0) {
      assert(pageContext.isClientSideNavigation === true)
    } else {
      assert(pageContext.isClientSideNavigation === false)
    }
  } else {
    assert(pageContext.isHydration === undefined)
    assert(pageContext.isClientSideNavigation === false)
  }
}
