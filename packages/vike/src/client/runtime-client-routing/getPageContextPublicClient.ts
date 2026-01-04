export { getPageContextPublicClient }
export type { PageContextForPublicUsageClient }
export type { PageContextPublicProxyClient }

import { getPageContextPublicClientShared } from '../shared/getPageContextPublicClientShared.js'
import type { PageContextConfig } from '../../shared-server-client/getPageFiles.js'
import type { PageContextInternalClient_ClientRouting } from '../../types/PageContext.js'
import type { PageContextPrepareMinimum } from '../../shared-server-client/preparePageContextForPublicUsage.js'

type PageContextForPublicUsageClient = PageContextPrepareMinimum &
  PageContextInternalClient_ClientRouting &
  PageContextConfig & { urlOriginal: string }

type PageContextPublicProxyClient = ReturnType<typeof getPageContextPublicClient>
function getPageContextPublicClient<PageContext extends PageContextForPublicUsageClient>(pageContext: PageContext) {
  return getPageContextPublicClientShared(pageContext)
}
