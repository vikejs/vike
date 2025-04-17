export { preparePageContextForUserConsumptionServerSide }
export type { PageContextForUserConsumptionServerSide }

import { assert, isPlainObject } from '../utils.js'
import { assertPageContextUrl, PageContextUrlInternal } from '../../../shared/getPageContextUrlComputed.js'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig.js'
import type { PageConfigUserFriendlyOld } from '../../../shared/page-configs/getPageConfigUserFriendly.js'
import { PageContextBuiltInServerInternal } from '../../../shared/types.js'
import { preparePageContextForUserConsumption } from '../../../shared/preparePageContextForUserConsumption.js'
import type { GlobalContextInternal, GlobalContextServerSidePublic } from '../globalContextServerSide.js'

type PageContextForUserConsumptionServerSide = PageContextBuiltInServerInternal &
  PageConfigUserFriendlyOld & {
    urlOriginal: string
    /** @deprecated */
    url: string
    urlPathname: string
    urlParsed: PageContextUrlInternal['urlParsed']
    routeParams: Record<string, string>
    Page: unknown
    pageId: string
    _pageConfigs: PageConfigRuntime[]
    is404: null | boolean
    isClientSideNavigation: boolean
    pageProps?: Record<string, unknown>
    _globalContext: GlobalContextInternal
    globalContext: GlobalContextServerSidePublic
  } & Record<string, unknown>

function preparePageContextForUserConsumptionServerSide(pageContext: PageContextForUserConsumptionServerSide): void {
  assertPageContextUrl(pageContext)
  assert(isPlainObject(pageContext.routeParams))
  assert('Page' in pageContext)
  assert(typeof pageContext.isClientSideNavigation === 'boolean')
  assert(pageContext._isPageContextObject)
  assert(pageContext.isClientSide === false)
  assert(typeof pageContext.isPrerendering === 'boolean')
  preparePageContextForUserConsumption(pageContext)
}
