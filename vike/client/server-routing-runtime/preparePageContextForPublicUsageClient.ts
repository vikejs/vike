export { preparePageContextForPublicUsageClient }
export type { PageContextForPublicUsageClient }

import { preparePageContextForPublicUsageClientShared } from '../shared/preparePageContextForPublicUsageClientShared.js'
import type { PageConfigUserFriendlyOld } from '../../shared/getPageFiles.js'
import type { PageContextInternalClient_ServerRouting } from '../../shared/types.js'
import type { PageContextMinimum } from '../../shared/preparePageContextForPublicUsage.js'

type PageContextForPublicUsageClient = PageContextMinimum &
  PageContextInternalClient_ServerRouting &
  PageConfigUserFriendlyOld

function preparePageContextForPublicUsageClient<PageContext extends PageContextForPublicUsageClient>(
  pageContext: PageContext
) {
  return preparePageContextForPublicUsageClientShared(pageContext)
}
