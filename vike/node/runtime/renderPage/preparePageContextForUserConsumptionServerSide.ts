export { preparePageContextForUserConsumptionServerSide }
export type { PageContextForUserConsumptionServerSide }

import { assert, isPlainObject, isObject } from '../utils.js'
import { sortPageContext } from '../../../shared/sortPageContext.js'
import { assertPageContextUrl, PageContextUrlInternal } from '../../../shared/getPageContextUrlComputed.js'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig.js'
import { addIs404ToPageProps } from '../../../shared/addIs404ToPageProps.js'
import type { PageContextExports } from '../../../shared/getPageFiles/getExports.js'
import { PageContextBuiltInServerInternal } from '../../../shared/types.js'

type PageContextForUserConsumptionServerSide = PageContextBuiltInServerInternal &
  PageContextExports & {
    urlOriginal: string
    /** @deprecated */
    url: string
    urlPathname: string
    urlParsed: PageContextUrlInternal['urlParsed']
    routeParams: Record<string, string>
    Page: unknown
    _pageId: string
    _pageConfigs: PageConfigRuntime[]
    is404: null | boolean
    isClientSideNavigation: boolean
    pageProps?: Record<string, unknown>
  } & Record<string, unknown>
function preparePageContextForUserConsumptionServerSide(pageContext: PageContextForUserConsumptionServerSide): void {
  assertPageContextUrl(pageContext)

  assert(isPlainObject(pageContext.routeParams))
  assert('Page' in pageContext)
  assert(isObject(pageContext.pageExports))
  assert(isObject(pageContext.exports))
  assert(isObject(pageContext.exportsAll))

  assert(typeof pageContext.isClientSideNavigation === 'boolean')

  sortPageContext(pageContext)

  addIs404ToPageProps(pageContext)
}
