export { preparePageContextForUserConsumptionServerSide }
export type { PageContextForUserConsumptionServerSide }

import { assert, isPlainObject } from '../utils.js'
import { assertPageContextUrl, PageContextUrlInternal } from '../../../shared/getPageContextUrlComputed.js'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig.js'
import type { PageConfigsUserFriendly } from '../../../shared/page-configs/getPageConfigsUserFriendly.js'
import { PageContextBuiltInServerInternal } from '../../../shared/types.js'
import { preparePageContextForUserConsumption } from '../../../shared/preparePageContextForUserConsumption.js'

type PageContextForUserConsumptionServerSide = PageContextBuiltInServerInternal &
  PageConfigsUserFriendly & {
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
  } & Record<string, unknown>

function preparePageContextForUserConsumptionServerSide(pageContext: PageContextForUserConsumptionServerSide): void {
  assertPageContextUrl(pageContext)
  assert(isPlainObject(pageContext.routeParams))
  assert('Page' in pageContext)
  assert(typeof pageContext.isClientSideNavigation === 'boolean')
  preparePageContextForUserConsumption(pageContext)
}
