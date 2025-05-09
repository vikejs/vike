export { preparePageContextForUserConsumptionServer }
export type { PageContextForUserConsumptionServer }

import { assertPageContextUrls, type PageContextUrlInternal } from '../../../shared/getPageContextUrlComputed.js'
import type { PageConfigUserFriendlyOld } from '../../../shared/page-configs/getUserFriendlyConfigs.js'
import { PageContextInternalServer } from '../../../shared/types.js'
import { preparePageContextForUserConsumption } from '../../../shared/preparePageContextForUserConsumption.js'
import type { GlobalContextServer } from '../globalContext.js'

type PageContextForUserConsumptionServer = PageContextInternalServer &
  PageConfigUserFriendlyOld & {
    urlOriginal: string
    /** @deprecated */
    url: string
    urlPathname: string
    urlParsed: PageContextUrlInternal['urlParsed']
    routeParams: Record<string, string>
    Page: unknown
    pageId: string
    is404: null | boolean
    isClientSideNavigation: boolean
    globalContext: GlobalContextServer
  }

function preparePageContextForUserConsumptionServer<PageContext extends PageContextForUserConsumptionServer>(
  pageContext: PageContext
) {
  // TODO/next-major-release: after we remove supportVueReactiviy() we can call this later inside the agnostic preparePageContextForUserConsumption()
  assertPageContextUrls(pageContext)
  preparePageContextForUserConsumption(pageContext)
  return pageContext
}
