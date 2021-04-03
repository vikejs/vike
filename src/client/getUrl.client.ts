import { assert, isNodejs } from '../utils'
import { parseUrl } from '../utils'

export { getUrl }
export { getUrlPathname }

/**
 Returns `${pathname}${search}${hash}`
*/
function getUrl(): string {
  assert(!isNodejs())
  const { href } = window.location
  const { origin, pathname, search, hash } = new URL(href)
  const url = `${pathname}${search}${hash}`
  assert(`${origin}${url}` === href || `${origin}${url}#` === href)
  assert(url.startsWith('/'))
  return url
}

function getUrlPathname() {
  assert(!isNodejs())
  const url = getUrl()
  return parseUrl(url).pathname
}
