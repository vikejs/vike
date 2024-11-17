export { preparePageContextForUserConsumptionServerSide }
export type { PageContextForUserConsumptionServerSide }

import { assert, isPlainObject } from '../utils'
import { assertPageContextUrl, PageContextUrlInternal } from '../../../shared/getPageContextUrlComputed'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig'
import type { PageContextExports } from '../../../shared/getPageFiles/getExports'
import { PageContextBuiltInServerInternal } from '../../../shared/types'
import { preparePageContextForUserConsumption } from '../../../shared/preparePageContextForUserConsumption'

type PageContextForUserConsumptionServerSide = PageContextBuiltInServerInternal &
  PageContextExports & {
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
