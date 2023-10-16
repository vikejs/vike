export { preparePageContextForUserConsumptionServerSide }
export type { PageContextForUserConsumptionServerSide }

import { assert, isPlainObject, isObject } from '../utils.js'
import { sortPageContext } from '../../../shared/sortPageContext.js'
import {
  assertPageContextUrlComputedProps,
  PageContextUrlComputedPropsInternal
} from '../../../shared/addUrlComputedProps.js'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig.js'
import { addIs404ToPageProps } from '../../../shared/addIs404ToPageProps.js'
import type { ConfigEntries, ExportsAll } from '../../../shared/getPageFiles/getExports.js'
import { PageContextBuiltInServerInternal } from '../../../shared/types.js'

type PageContextForUserConsumptionServerSide = PageContextBuiltInServerInternal & {
  urlOriginal: string
  /** @deprecated */
  url: string
  urlPathname: string
  urlParsed: PageContextUrlComputedPropsInternal['urlParsed']
  routeParams: Record<string, string>
  Page: unknown
  pageExports: Record<string, unknown>
  config: Record<string, unknown>
  configEntries: ConfigEntries
  exports: Record<string, unknown>
  exportsAll: ExportsAll
  _pageId: string
  _pageConfigs: PageConfigRuntime[]
  is404: null | boolean
  isClientSideNavigation: boolean
  pageProps?: Record<string, unknown>
} & Record<string, unknown>
function preparePageContextForUserConsumptionServerSide(pageContext: PageContextForUserConsumptionServerSide): void {
  assertPageContextUrlComputedProps(pageContext)

  assert(isPlainObject(pageContext.routeParams))
  assert('Page' in pageContext)
  assert(isObject(pageContext.pageExports))
  assert(isObject(pageContext.exports))
  assert(isObject(pageContext.exportsAll))

  assert(typeof pageContext.isClientSideNavigation === 'boolean')

  sortPageContext(pageContext)

  addIs404ToPageProps(pageContext)
}
