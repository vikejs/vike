export { getPageContext }
export { providePageContext }

import { getPageContext as getPageContext_sync, providePageContext } from '../../shared-server-client/hooks/execHook.js'
import { getPageContextClient } from './renderPageClient.js'
import type { GetPageContextParams } from '../../server/runtime/getPageContext.js'

// Setting return type to `unknown` because it's the type of the server-side getPageContext() that is publicly exposed
function getPageContext({ clientFallback }: GetPageContextParams = {}): unknown {
  {
    const pageContext = getPageContext_sync()
    if (pageContext) return pageContext
  }

  if (clientFallback !== false) {
    const pageContext = getPageContextClient()
    if (pageContext) return pageContext
  }

  return null
}
