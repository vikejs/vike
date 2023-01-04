export { preparePageContextForRelease }
export type { PageContextPublic }

import { isErrorPageId } from '../../../shared/route'
import type { ExportsAll } from '../../../shared/getPageFiles'
import { assert, hasProp, isPlainObject, isObject } from '../../utils'
import { sortPageContext } from '../../../shared/sortPageContext'
import { addIs404ToPageProps } from '../../helpers'
import { assertURLs, PageContextUrls } from '../../../shared/addComputedUrlProps'

type PageContextPublic = {
  urlOriginal: string
  /** @deprecated */
  url: string
  urlPathname: string
  urlParsed: PageContextUrls['urlParsed']
  routeParams: Record<string, string>
  Page: unknown
  pageExports: Record<string, unknown>
  exports: Record<string, unknown>
  exportsAll: ExportsAll
  _pageId: string
  is404: null | boolean
  pageProps?: Record<string, unknown>
}
function preparePageContextForRelease<T extends PageContextPublic>(pageContext: T): void {
  assertURLs(pageContext)

  assert(isPlainObject(pageContext.routeParams))
  assert('Page' in pageContext)
  assert(isObject(pageContext.pageExports))
  assert(isObject(pageContext.exports))
  assert(isObject(pageContext.exportsAll))

  sortPageContext(pageContext)

  if (isErrorPageId(pageContext._pageId)) {
    assert(hasProp(pageContext, 'is404', 'boolean'))
    addIs404ToPageProps(pageContext)
  }
}
