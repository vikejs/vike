import { assert } from '../utils'

export { getUrl }

/**
  Returns `${pathname}${search}${hash}`
*/
function getUrl(): string {
  const { href } = window.location
  const { origin, pathname, search, hash } = new URL(href)
  const url = `${pathname}${search}${hash}`
  assert(`${origin}${url}` === href)
  assert(url.startsWith('/'))
  return url
}
