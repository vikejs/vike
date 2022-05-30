export { isAlreadyPrefetched }
export { markAsAlreadyPrefetched }

import { getUrlPathname } from '../utils'

const linkAlreadyPrefetched = new Map<string, true>()

function isAlreadyPrefetched(url: string): boolean {
  const prefetchUrl = getPrefetchUrl(url)
  return linkAlreadyPrefetched.has(prefetchUrl)
}
function markAsAlreadyPrefetched(url: string): void {
  const prefetchUrl = getPrefetchUrl(url)
  linkAlreadyPrefetched.set(prefetchUrl, true)
}
function getPrefetchUrl(url: string) {
  return getUrlPathname(url)
}
