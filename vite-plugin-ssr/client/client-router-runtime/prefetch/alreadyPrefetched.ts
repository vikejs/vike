export { isAlreadyPrefetched }
export { markAsAlreadyPrefetched }

import { parseUrl } from '../utils'

const linkAlreadyPrefetched = new Map<string, true>()

function isAlreadyPrefetched(url: string): boolean {
  const urlPathname = getUrlPathname(url)
  return linkAlreadyPrefetched.has(urlPathname)
}
function markAsAlreadyPrefetched(url: string): void {
  const urlPathname = getUrlPathname(url)
  linkAlreadyPrefetched.set(urlPathname, true)
}

function getUrlPathname(url: string): string {
  const urlPathname = parseUrl(url, '/').pathname
  return urlPathname
}
