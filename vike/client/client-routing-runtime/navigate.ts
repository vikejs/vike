export { navigate }
export { reload }

import { renderPageClientSide } from './installClientRouter.js'
import { assertUsage, isBrowser, assertClientRouting, checkIfClientRouting, getCurrentUrl } from './utils.js'

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
  assertUsage(isBrowser(), 'The navigate() function can be called only on the client-side', { showStackTrace: true })
  const errMsg = 'navigate() works only with Client Routing, see https://vike.dev/navigate'
  assertUsage(checkIfClientRouting(), errMsg, { showStackTrace: true })
  assertUsage(url, '[navigate(url)] Missing argument url', { showStackTrace: true })
  assertUsage(typeof url === 'string', '[navigate(url)] Argument url should be a string', { showStackTrace: true })
  assertUsage(
    typeof keepScrollPosition === 'boolean',
    '[navigate(url, { keepScrollPosition })] Argument keepScrollPosition should be a boolean',
    { showStackTrace: true }
  )
  assertUsage(
    typeof overwriteLastHistoryEntry === 'boolean',
    '[navigate(url, { overwriteLastHistoryEntry })] Argument overwriteLastHistoryEntry should be a boolean',
    { showStackTrace: true }
  )
  assertUsage(url.startsWith('/'), '[navigate(url)] Argument url should start with a leading /', {
    showStackTrace: true
  })

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
