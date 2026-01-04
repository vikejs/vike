export { getPageContextPublicClient }
export type { PageContextForPublicUsageClient }

import { getPageContextPublicClientShared } from '../shared/getPageContextPublicClientShared.js'
import type { PageContextConfig } from '../../shared-server-client/getPageFiles.js'
import type { PageContextInternalClient_ServerRouting } from '../../types/PageContext.js'
import type { PageContextPrepareMinimum } from '../../shared-server-client/preparePageContextForPublicUsage.js'

type PageContextForPublicUsageClient = PageContextPrepareMinimum &
  PageContextInternalClient_ServerRouting &
  PageContextConfig

function getPageContextPublicClient<PageContext extends PageContextForPublicUsageClient>(pageContext: PageContext) {
  return getPageContextPublicClientShared(pageContext)
}
