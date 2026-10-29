export { onCreatePageContext }

import type { PageContextServer } from '../../renderer/types'
import { getPageContext } from 'vike/getPageContext'
import { assert } from '../../utils/assert'

async function onCreatePageContext(pageContext: PageContextServer) {
  pageContext.errorDescription = pageContext.is404 ? 'Page not found.' : 'Something went wrong.'

  // TEST: getPageContext({ asyncHook: true }) after an `await`
  await new Promise((r) => setTimeout(r, 0))
  {
    const pageContext2 = getPageContext({ asyncHook: true })
    assert(pageContext2)
    assert(pageContext2.pageId === pageContext.pageId)
  }
}
