export { preparePageContextForPublicUsageServer }
export type { PageContextForPublicUsageServer }

import { assertPageContextUrls, type PageContextUrlInternal } from '../../../shared/getPageContextUrlComputed.js'
import type { PageConfigUserFriendlyOld } from '../../../shared/page-configs/getUserFriendlyConfigs.js'
import { PageContextInternalServer } from '../../../shared/types.js'
import { preparePageContextForPublicUsage } from '../../../shared/preparePageContextForPublicUsage.js'
import type { GlobalContextServer } from '../globalContext.js'

type PageContextForPublicUsageServer = PageContextInternalServer &
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

function preparePageContextForPublicUsageServer<PageContext extends PageContextForPublicUsageServer>(
  pageContext: PageContext
) {
  // TODO/next-major-release: after we remove supportVueReactiviy() we can call this later inside the agnostic preparePageContextForPublicUsage()
  assertPageContextUrls(pageContext)
  preparePageContextForPublicUsage(pageContext)
  return pageContext
}
