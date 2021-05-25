import { assert } from './assert'
import { isPlainObject } from './isPlainObject'
import { getUrlFull, getUrlParsed, getUrlPathname } from './parseUrl'

export { addUrlToPageContext }

function addUrlToPageContext(pageContext: Record<string, unknown>, url: string) {
  const urlFull = getUrlFull(url)
  const urlPathname = getUrlPathname(url)
  const urlParsed = getUrlParsed(url)
  assert(urlPathname.startsWith('/') && urlFull.startsWith('/'))
  assert(isPlainObject(urlParsed))
  Object.assign(pageContext, { urlFull, urlPathname, urlParsed })
}
