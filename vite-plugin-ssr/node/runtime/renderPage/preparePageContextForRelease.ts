export { preparePageContextForRelease }
export type { PageContextPublic }

import { assert, isPlainObject, isObject } from '../utils'
import { sortPageContext } from '../../../shared/sortPageContext'
import { assertURLs, PageContextUrls } from '../../../shared/addComputedUrlProps'
import type { PlusConfig } from '../../../shared/page-configs/PlusConfig'
import { addIs404ToPageProps } from '../../../shared/addIs404ToPageProps'
import type { ConfigEntries, ExportsAll } from '../../../shared/getPageFiles/getExports'

type PageContextPublic = {
  urlOriginal: string
  /** @deprecated */
  url: string
  urlPathname: string
  urlParsed: PageContextUrls['urlParsed']
  routeParams: Record<string, string>
  Page: unknown
  pageExports: Record<string, unknown>
  config: Record<string, unknown>
  configEntries: ConfigEntries
  exports: Record<string, unknown>
  exportsAll: ExportsAll
  _pageId: string
  _plusConfigs: PlusConfig[]
  is404: null | boolean
  isClientSideNavigation: boolean
  pageProps?: Record<string, unknown>
}
function preparePageContextForRelease<T extends PageContextPublic>(pageContext: T): void {
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
