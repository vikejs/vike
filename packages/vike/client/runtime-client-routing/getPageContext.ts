export { getPageContext }
export { providePageContext }

import { getPageContext as getPageContext_sync, providePageContext } from '../../shared-server-client/hooks/execHook.js'
import { getPageContextClient } from './renderPageClient.js'
import type { GetPageContextParams } from '../../server/runtime/getPageContext.js'

// Return type `never` because it's the type of the server-side getPageContext() that is publicly exposed
type TypeIsNotExported = never
function getPageContext({ asyncHook }: GetPageContextParams = {}): TypeIsNotExported {
  {
    const pageContext = getPageContext_sync()
    if (pageContext) return pageContext as TypeIsNotExported
  }

  // We only use getPageContextClient() if `asyncHook: true` in order to foster isomorphic code (so that, for example, toggling `ssr: boolean` works seamlessly)
  if (asyncHook) {
    const pageContext = getPageContextClient()
    if (pageContext) return pageContext as TypeIsNotExported
  }

  return null as TypeIsNotExported
}
