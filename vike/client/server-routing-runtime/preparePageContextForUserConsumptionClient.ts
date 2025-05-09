export { preparePageContextForUserConsumptionClient }
export type { PageContextForUserConsumptionClient }

import { preparePageContextForUserConsumptionClientShared } from '../shared/preparePageContextForUserConsumptionClientShared.js'
import type { PageConfigUserFriendlyOld } from '../../shared/getPageFiles.js'
import type { PageContextBuiltInClientInternalServerRouting } from '../../shared/types.js'

type PageContextForUserConsumptionClient = PageContextBuiltInClientInternalServerRouting &
  PageConfigUserFriendlyOld & {
    urlOriginal: string
  }

function preparePageContextForUserConsumptionClient<PageContext extends PageContextForUserConsumptionClient>(
  pageContext: PageContext
) {
  return preparePageContextForUserConsumptionClientShared(pageContext)
}
