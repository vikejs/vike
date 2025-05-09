export { preparePageContextForUserConsumptionClient }
export type { PageContextForUserConsumptionClient }

import { preparePageContextForUserConsumptionClientShared } from '../shared/preparePageContextForUserConsumptionClientShared.js'
import type { PageConfigUserFriendlyOld } from '../../shared/getPageFiles.js'
import type { PageContextBuiltInClientInternalClientRouting } from '../../shared/types.js'

type PageContextForUserConsumptionClient = PageContextBuiltInClientInternalClientRouting &
  PageConfigUserFriendlyOld & { urlOriginal: string }

function preparePageContextForUserConsumptionClient<PageContext extends PageContextForUserConsumptionClient>(
  pageContext: PageContext
) {
  return preparePageContextForUserConsumptionClientShared(pageContext)
}
