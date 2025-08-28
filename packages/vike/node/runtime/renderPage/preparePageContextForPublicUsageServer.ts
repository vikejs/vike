export { preparePageContextForPublicUsageServer }
export type { PageContextForPublicUsageServer }

import type { PageContextUrlInternal } from '../../../shared/getPageContextUrlComputed.js'
import type { PageContextConfig } from '../../../shared/page-configs/resolveVikeConfigPublic.js'
import type { PageContextInternalServer } from '../../../types/PageContext.js'
import {
  assertPropertyGetters,
  preparePageContextForPublicUsage,
} from '../../../shared/preparePageContextForPublicUsage.js'
import type { GlobalContextServerInternal } from '../globalContext.js'

type PageContextForPublicUsageServer = PageContextInternalServer &
  PageContextConfig & {
    urlOriginal: string
    /** @deprecated */
    url: string
    urlPathname: string
    urlParsed: PageContextUrlInternal['urlParsed']
    routeParams: Record<string, string>
    Page: unknown
    pageId: string
    is404: null | boolean
    _globalContext: GlobalContextServerInternal
  }

function preparePageContextForPublicUsageServer<PageContext extends PageContextForPublicUsageServer>(
  pageContext: PageContext,
) {
  // TO-DO/next-major-release: after we remove supportVueReactiviy() we can call this later inside the agnostic preparePageContextForPublicUsage()
  assertPropertyGetters(pageContext)
  pageContext = preparePageContextForPublicUsage(pageContext)
  return pageContext
}
