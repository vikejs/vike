export { preparePageContextForUserConsumptionServerSide }
export type { PageContextForUserConsumptionServerSide }

import { assert, isPlainObject, isObject } from '../utils'
import { sortPageContext } from '../../../shared/sortPageContext'
import { assertURLs, PageContextUrls } from '../../../shared/addComputedUrlProps'
import type { PageConfig } from '../../../shared/page-configs/PageConfig'
import { addIs404ToPageProps } from '../../../shared/addIs404ToPageProps'
import type { ConfigEntries, ExportsAll } from '../../../shared/getPageFiles/getExports'
import type { PageContextBuiltIn } from '../../../types'

type PageContextForUserConsumptionServerSide = {
  urlOriginal: string
  /** @deprecated */
  url: string
  urlPathname: string
  urlRewrite: null | string
  urlRedirect: null | string
  urlParsed: PageContextUrls['urlParsed']
  routeParams: Record<string, string>
  Page: unknown
  pageExports: Record<string, unknown>
  config: Record<string, unknown>
  configEntries: ConfigEntries
  exports: Record<string, unknown>
  exportsAll: ExportsAll
  _pageId: string
  _pageConfigs: PageConfig[]
  is404: null | boolean
  isClientSideNavigation: boolean
  pageProps?: Record<string, unknown>
} & PageContextBuiltIn
function preparePageContextForUserConsumptionServerSide<T extends PageContextForUserConsumptionServerSide>(
  pageContext: T
): void {
  assertURLs(pageContext)

  assert(isPlainObject(pageContext.routeParams))
  assert('Page' in pageContext)
  assert(isObject(pageContext.pageExports))
  assert(isObject(pageContext.exports))
  assert(isObject(pageContext.exportsAll))

  assert(typeof pageContext.isClientSideNavigation === 'boolean')

  sortPageContext(pageContext)

  addIs404ToPageProps(pageContext)
}
