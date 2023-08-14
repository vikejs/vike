export { preparePageContextForUserConsumptionServerSide }
export type { PageContextForUserConsumptionServerSide }

import { assert, isPlainObject, isObject } from '../utils'
import { sortPageContext } from '../../../shared/sortPageContext'
import {
  assertPageContextUrlComputedPropsPublic,
  PageContextUrlComputedPropsPublic
} from '../../../shared/UrlComputedProps'
import type { PageConfig } from '../../../shared/page-configs/PageConfig'
import { addIs404ToPageProps } from '../../../shared/addIs404ToPageProps'
import type { ConfigEntries, ExportsAll } from '../../../shared/getPageFiles/getExports'
import type { PageContextBuiltIn } from '../../../types'

type PageContextForUserConsumptionServerSide = {
  urlOriginal: string
  /** @deprecated */
  url: string
  urlPathname: string
  urlParsed: PageContextUrlComputedPropsPublic['urlParsed']
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
function preparePageContextForUserConsumptionServerSide(
  pageContext: PageContextForUserConsumptionServerSide
): void {
  assertPageContextUrlComputedPropsPublic(pageContext)

  assert(isPlainObject(pageContext.routeParams))
  assert('Page' in pageContext)
  assert(isObject(pageContext.pageExports))
  assert(isObject(pageContext.exports))
  assert(isObject(pageContext.exportsAll))

  assert(typeof pageContext.isClientSideNavigation === 'boolean')

  sortPageContext(pageContext)

  addIs404ToPageProps(pageContext)
}
