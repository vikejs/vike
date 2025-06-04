export { preparePageContextForPublicUsageServer }
export type { PageContextForPublicUsageServer }

import type { PageContextUrlInternal } from '../../../shared/getPageContextUrlComputed.js'
import type { VikeConfigPublicPageLazy } from '../../../shared/page-configs/getVikeConfigPublic.js'
import type { PageContextInternalServer } from '../../../shared/types.js'
import {
  assertPropertyGetters,
  preparePageContextForPublicUsage
} from '../../../shared/preparePageContextForPublicUsage.js'
import type { GlobalContextServerInternal } from '../globalContext.js'

type PageContextForPublicUsageServer = PageContextInternalServer &
  VikeConfigPublicPageLazy & {
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
    _globalContext: GlobalContextServerInternal
  }

function preparePageContextForPublicUsageServer<PageContext extends PageContextForPublicUsageServer>(
  pageContext: PageContext
) {
  // TODO/next-major-release: after we remove supportVueReactiviy() we can call this later inside the agnostic preparePageContextForPublicUsage()
  assertPropertyGetters(pageContext)
  pageContext = preparePageContextForPublicUsage(pageContext)
  return pageContext
}
