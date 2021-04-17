import { assert } from './assert'
import { parseUrl } from './parseUrl'

export { addUrlToContextProps }

function addUrlToContextProps(contextProps: Record<string, unknown>, url: string) {
  const { pathname, search, hash } = parseUrl(url)
  const urlFull = `${pathname}${search}${hash}`
  const urlPathname = pathname
  assert(urlPathname.startsWith('/') && urlFull.startsWith('/'))
  Object.assign(contextProps, { urlFull, urlPathname })
}
