export { onBeforeRenderClient }

import type { PageContextClient } from 'vike/types'
import { assert } from './utils/assert'
import { getGlobalContext, getGlobalContextAsync, getGlobalContextSync } from 'vike'

async function onBeforeRenderClient(pageContext: PageContextClient) {
  // TODO/ai wrap every log in test/playground using the if condition below
  if (import.meta.env.PUBLIC_ENV__TEST) {
    console.log('+onBeforeRenderClient hook called')
  }

  // TEST: pageContext.isClientSide
  assert(pageContext.isClientSide)
  assert(pageContext.globalContext.isClientSide)

  // TEST: getGlobalContext()
  assert((await getGlobalContext()).isClientSide)
  assert((await getGlobalContextAsync(import.meta.env.PROD)).isClientSide)
  assert(getGlobalContextSync().isClientSide)
}
