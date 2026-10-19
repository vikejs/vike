export { onBeforeRenderClient }

import type { PageContextClient } from 'vike/types'
import { assert } from './utils/assert'
import { getGlobalContext, getGlobalContextAsync, getGlobalContextSync } from 'vike'

let pageContextOnScreen: { urlOriginal: string; hasPreviousPageContext: boolean } | undefined
async function onBeforeRenderClient(pageContext: PageContextClient) {
  if (import.meta.env.PUBLIC_ENV__TEST) {
    console.log('+onBeforeRenderClient hook called')
  }

  // TEST: pageContext.isClientSide
  assert(pageContext.isClientSide)
  assert(pageContext.globalContext.isClientSide)

  // TEST: only the last three pageContexts are kept in memory
  assert(!pageContext.previousPageContext?.previousPageContext?.previousPageContext)

  // TEST: the page on screen keeps its previousPageContext while the next page renders
  if (
    pageContextOnScreen?.hasPreviousPageContext &&
    pageContext.previousPageContext?.urlOriginal === pageContextOnScreen.urlOriginal
  ) {
    assert(pageContext.previousPageContext.previousPageContext)
  }
  pageContextOnScreen = {
    urlOriginal: pageContext.urlOriginal,
    hasPreviousPageContext: !!pageContext.previousPageContext,
  }

  // TEST: getGlobalContext()
  assert((await getGlobalContext()).isClientSide)
  assert((await getGlobalContextAsync(import.meta.env.PROD)).isClientSide)
  assert(getGlobalContextSync().isClientSide)
}
