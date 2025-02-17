export { navigate }
export { reload }

import { getCurrentUrl } from '../shared/getCurrentUrl.js'
import { normalizeUrlArgument } from './normalizeUrlArgument.js'
import { firstRenderStartPromise, renderPageClientSide } from './renderPageClientSide.js'
import type { ScrollTarget } from './setScrollPosition.js'
import { assertClientRouting } from './utils.js'
import type { PageContextClient } from '../../shared/types.js'

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
    keepScrollPosition = false,
    overwriteLastHistoryEntry = false,
    pageContext
  }: { keepScrollPosition?: boolean; overwriteLastHistoryEntry?: boolean; pageContext?: Record<string, unknown> } = {}
): Promise<{ pageContext: PageContextClient }> {
  normalizeUrlArgument(url, 'navigate')

  // If `hydrationCanBeAborted === false` (e.g. Vue) then we can apply navigate() only after hydration is done
  await firstRenderStartPromise

  const scrollTarget: ScrollTarget = { preserveScroll: keepScrollPosition }
  const pageContextNew = await renderPageClientSide({
    scrollTarget,
    urlOriginal: url,
    overwriteLastHistoryEntry,
    isBackwardNavigation: false,
    pageContextInitClient: pageContext
  })
  return { pageContext: pageContextNew }
}

async function reload(): Promise<{ pageContext: PageContextClient }> {
  const { pageContext } = await navigate(getCurrentUrl())
  return { pageContext }
}
