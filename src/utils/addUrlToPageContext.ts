import { assert } from './assert'
import { isPlainObject } from './isPlainObject'
import { getUrlFull, getUrlParsed, getUrlPathname } from './parseUrl'

export { addUrlToPageContext }
export { addPageIdToPageContext }
export { assertPageContext }

type PageContext = Record<string, unknown>

function addUrlToPageContext(pageContext: PageContext, url: string) {
  assert(isPlainObject(pageContext))
  assert(typeof url === 'string')
  const urlFull = getUrlFull(url)
  const urlPathname = getUrlPathname(url)
  const urlParsed = getUrlParsed(url)
  assert(urlPathname.startsWith('/') && urlFull.startsWith('/'))
  assert(isPlainObject(urlParsed))
  Object.assign(pageContext, { urlFull, urlPathname, urlParsed })
}

function addPageIdToPageContext(pageContext: PageContext, pageId: string) {
  assert(isPlainObject(pageContext))
  assert(typeof pageId === 'string')
  Object.assign(pageContext, { pageId })
}

function assertPageContext(pageContext: PageContext) {
  assert(typeof pageContext.urlFull === 'string')
  assert(typeof pageContext.urlPathname === 'string')
  assert(isPlainObject(pageContext.urlParsed))
  assert(typeof pageContext.pageId === 'string')
}
