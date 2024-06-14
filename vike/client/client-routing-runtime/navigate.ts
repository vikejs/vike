export { navigate }
export { reload }

import { renderPageClientSide } from './renderPageClientSide.js'
import type { ScrollTarget } from './setScrollPosition.js'
import { assertClientRouting, assertWarning, assertUsageUrlPathname, getCurrentUrl } from './utils.js'

assertClientRouting()

/** Programmatically navigate to a new page.
 *
 * https://vike.dev/navigate
 *
 * @param url - The URL of the new page.
 * @param keepScrollPosition - Don't scroll to the top of the page, instead keep the current scroll position.
 * @param overwriteLastHistoryEntry - Don't create a new entry in the browser's history, instead let the new URL replace the current URL. (This effectively removes the current URL from the browser history).
 */
async function navigate(
  url: string,
  {
    keepScrollPosition,
    overwriteLastHistoryEntry = false
  }: { keepScrollPosition?: boolean; overwriteLastHistoryEntry?: boolean } = {}
): Promise<void> {
  assertUsageUrlPathname(url, '[navigate(url)] url')
  // TODO/next-major-release: remove
  assertWarning(
    keepScrollPosition,
    'argument keepScrollPosition of navigate() is deprecated in favor of argument scroll',
    { onlyOnce: true, showStackTrace: true }
  )
  let scrollTarget: ScrollTarget
  if (keepScrollPosition !== undefined) {
    scrollTarget = { preserveScroll: keepScrollPosition }
  }
  await renderPageClientSide({
    scrollTarget,
    urlOriginal: url,
    overwriteLastHistoryEntry,
    isBackwardNavigation: false
  })
}

async function reload(): Promise<void> {
  await navigate(getCurrentUrl())
}
