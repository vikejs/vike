export { preparePageContextForPublicUsageClient }
export type { PageContextForPublicUsageClient }

import { preparePageContextForPublicUsageClientShared } from '../shared/preparePageContextForPublicUsageClientShared.js'
import type { PageConfigUserFriendlyOld } from '../../shared/getPageFiles.js'
import type { PageContextInternalClient_ServerRouting } from '../../shared/types.js'

type PageContextForPublicUsageClient = PageContextInternalClient_ServerRouting & PageConfigUserFriendlyOld

function preparePageContextForPublicUsageClient<PageContext extends PageContextForPublicUsageClient>(
  pageContext: PageContext
) {
  return preparePageContextForPublicUsageClientShared(pageContext)
}
