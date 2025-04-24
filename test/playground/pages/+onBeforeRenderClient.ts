export { onBeforeRenderClient }

import type { PageContextClient } from 'vike/types'
import { assert } from '../utils/assert'
import { getGlobalContext, getGlobalContextAsync } from 'vike'

async function onBeforeRenderClient(pageContext: PageContextClient) {
  // TEST: pageContext.isClientSide
  assert(!pageContext.isClientSide)
  assert(!pageContext.globalContext.isClientSide)

  // TEST: getGlobalContext()
  assert((await getGlobalContext()) === pageContext.globalContext)
  assert((await getGlobalContextAsync(import.meta.env.PROD)) === pageContext.globalContext)
}
