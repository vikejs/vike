export { preparePageContextForUserConsumptionClient }
export type { PageContextForUserConsumptionClient }

import { preparePageContextForUserConsumptionClientShared } from '../shared/preparePageContextForUserConsumptionClientShared.js'
import type { PageConfigUserFriendlyOld } from '../../shared/getPageFiles.js'
import type { PageContextInternalClient_ServerRouting } from '../../shared/types.js'

type PageContextForUserConsumptionClient = PageContextInternalClient_ServerRouting & PageConfigUserFriendlyOld

function preparePageContextForUserConsumptionClient<PageContext extends PageContextForUserConsumptionClient>(
  pageContext: PageContext
) {
  return preparePageContextForUserConsumptionClientShared(pageContext)
}
