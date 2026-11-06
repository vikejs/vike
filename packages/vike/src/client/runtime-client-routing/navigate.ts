export { navigate }
export { reload }
export { handleError }

// import { modifyUrlSameOrigin, ModifyUrlSameOriginOptions } from '../../shared/modifyUrlSameOrigin.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'
import { normalizeUrlArgument } from './normalizeUrlArgument.js'
import { renderPageClient } from './renderPageClient.js'
import type { ScrollTarget } from './setScrollPosition.js'
import { assertClientRouting } from '../../utils/assertRoutingType.js'
import { initClientRouter } from './initClientRouter.js'
import '../assertEnvClient.js'

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

  // Ensure initClientRouter() is called before navigate() — otherwise race condition when +client.js calls navigate() before initClientRouter() is called in runtime-client-routing/entry.ts
  initClientRouter()

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

/** Let Vike handle an error thrown outside of Vike's hooks, as if a hook threw it: Vike renders the error page, or follows `throw render()` and `throw redirect()`.
 *
 * https://vike.dev/handleError
 *
 * @param err - The thrown value, e.g. the error of a UI component that threw after its page rendered.
 */
async function handleError(err: unknown): Promise<void> {
  initClientRouter()
  await renderPageClient({
    scrollTarget: { preserveScroll: false },
    thrown: { err },
    isRecovery: true,
    isClientSideNavigation: false, // Nothing navigated => when the error page's .pageContext.json is missing, no hard reload (the reloaded page could throw the same error again, in a loop)
  })
}
