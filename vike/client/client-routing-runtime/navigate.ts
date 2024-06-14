export { navigate }
export { reload }

import { renderPageClientSide } from './renderPageClientSide.js'
import { assertClientRouting, getCurrentUrl } from './utils.js'

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
  { keepScrollPosition = false, overwriteLastHistoryEntry = false } = {}
): Promise<void> {
  const scrollTarget = keepScrollPosition ? 'preserve-scroll' : 'scroll-to-top-or-hash'
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
