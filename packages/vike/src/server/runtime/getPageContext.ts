export { getPageContext }
export { providePageContext }
export type { GetPageContextParams }

import { getPageContext_withAsyncHook } from './asyncHook.js'
import { getPageContext_sync, providePageContext } from '../../shared-server-client/hooks/execHook.js'
import type { PageContextClient, PageContextServer } from '../../types/PageContext.js'
import '../assertEnvServer.js'

type GetPageContextParams = Parameters<typeof getPageContext>[0]
/**
 * Access `pageContext` object inside Vike hooks, in order to create universal hooks.
 *
 * https://vike.dev/getPageContext
 */
function getPageContext<PageContext = PageContextClient | PageContextServer>({
  asyncHook,
}: { asyncHook?: boolean } = {}): null | PageContext {
  {
    const pageContext = getPageContext_sync()
    if (pageContext) return pageContext as any
  }

  if (asyncHook) {
    const pageContext = getPageContext_withAsyncHook()
    if (pageContext) return pageContext as any
  }

  return null
}
