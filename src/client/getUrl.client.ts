import { assert, isNodejs } from '../utils'
/**
 Returns `${pathname}${search}${hash}`
*/
export function getUrl(): string | null {
  if (isNodejs()) return null
  const { href } = window.location
  const { origin, pathname, search, hash } = new URL(href)
  const url = `${pathname}${search}${hash}`
  assert(`${origin}${url}` === href)
  assert(url.startsWith('/'))
  return url
}
