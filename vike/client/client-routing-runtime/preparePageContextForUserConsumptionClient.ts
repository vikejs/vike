export { preparePageContextForUserConsumptionClient }
export type { PageContextForUserConsumptionClient }

import { preparePageContextForUserConsumptionClientShared } from '../shared/preparePageContextForUserConsumptionClientShared.js'
import type { PageConfigUserFriendlyOld } from '../../shared/getPageFiles.js'
import type { PageContextInternalClient_ClientRouting } from '../../shared/types.js'

type PageContextForUserConsumptionClient = PageContextInternalClient_ClientRouting &
  PageConfigUserFriendlyOld & { urlOriginal: string }

function preparePageContextForUserConsumptionClient<PageContext extends PageContextForUserConsumptionClient>(
  pageContext: PageContext
) {
  return preparePageContextForUserConsumptionClientShared(pageContext)
}
