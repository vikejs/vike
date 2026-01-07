import '../assertEnvClient.js'

export { navigate }
export { reload }

// import { modifyUrlSameOrigin, ModifyUrlSameOriginOptions } from '../../shared/modifyUrlSameOrigin.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'
import { normalizeUrlArgument } from './normalizeUrlArgument.js'
import { firstRenderStartPromise, renderPageClient } from './renderPageClient.js'
import type { ScrollTarget } from './setScrollPosition.js'
import { assertClientRouting } from '../../utils/assertRoutingType.js'

assertClientRouting()

type Options = /*ModifyUrlSameOriginOptions &*/ {
  // url?: string // or name it `href?: string` instead?
  keepScrollPosition?: boolean
  overwriteLastHistoryEntry?: boolean
  pageContext?: Record<string, unknown>
}

/** Programmatically navigate to a new page.
 *
 * https://vike.dev/navigate
 *
 * @param url - The URL of the new page.
 * @param keepScrollPosition - Don't scroll to the top of the page, instead keep the current scroll position.
 * @param overwriteLastHistoryEntry - Don't create a new entry in the browser's history, instead let the new URL replace the current URL. (This effectively removes the current URL from the browser history).
 */
async function navigate(url: string, options?: Options): Promise<void> {
  // let url = normalizeUrlArgument(options.url ?? getCurrentUrl(), 'navigate')
  // url = modifyUrlSameOrigin(url, options)
  normalizeUrlArgument(url, 'navigate')

  // If `hydrationCanBeAborted === false` (e.g. Vue) then we can apply navigate() only after hydration is done
  await firstRenderStartPromise

  const { keepScrollPosition, overwriteLastHistoryEntry, pageContext } = options ?? {}
  const scrollTarget: ScrollTarget = { preserveScroll: keepScrollPosition ?? false }
  await renderPageClient({
    scrollTarget,
    urlOriginal: url,
    overwriteLastHistoryEntry,
    pageContextInitClient: pageContext,
  })
}

async function reload(): Promise<void> {
  await navigate(getCurrentUrl())
}
