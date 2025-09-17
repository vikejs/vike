export { onBeforeRenderHtml }

import type { PageContextServer } from 'vike/types'
import { assert } from '../utils/assert'
import { getGlobalContext, getGlobalContextAsync, getGlobalContextSync } from 'vike'

async function onBeforeRenderHtml(pageContext: PageContextServer) {
  console.log('+onBeforeRenderHtml hook called')

  // TEST: pageContext.isClientSide
  assert(!pageContext.isClientSide)
  assert(!pageContext.globalContext.isClientSide)

  // TEST: getGlobalContext()
  assert(!(await getGlobalContext()).isClientSide)
  assert(!(await getGlobalContextAsync(import.meta.env.PROD)).isClientSide)
  assert(!getGlobalContextSync().isClientSide)
}
