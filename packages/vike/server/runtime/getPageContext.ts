export { getPageContext }
export { providePageContext }
export type { GetPageContextParams }

import { getPageContext_withAsyncHook } from '../../node/vite/shared/getHttpRequestAsyncStore.js'
import { getPageContext as getPageContext_sync, providePageContext } from '../../shared-server-client/hooks/execHook.js'
import type { PageContextClient, PageContextServer } from '../../types/PageContext.js'

type GetPageContextParams = Parameters<typeof getPageContext>[0]
function getPageContext<PageContext = PageContextClient | PageContextServer>({
  asyncHook,
}: { asyncHook?: boolean; clientFallback?: boolean } = {}): null | PageContext {
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
