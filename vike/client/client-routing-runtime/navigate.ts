export { navigate }
export { reload }

import { modifyUrlSameOrigin, ModifyUrlSameOriginOptions } from '../../shared/modifyUrlSameOrigin.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'
import { normalizeUrlArgument } from './normalizeUrlArgument.js'
import { firstRenderStartPromise, renderPageClientSide } from './renderPageClientSide.js'
import type { ScrollTarget } from './setScrollPosition.js'
import { assertClientRouting, assertWarning } from './utils.js'

assertClientRouting()

type Options = ModifyUrlSameOriginOptions & {
  url?: string
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
async function navigate(
  arg: string | Options,
  // TODO/next-major: remove
  options_deprecated?: Options
): Promise<void> {
  const options: Options = typeof arg === 'string' ? { url: arg } : arg
  if (options_deprecated) {
    assertWarning(false, 'TODO/now', { onlyOnce: true })
    Object.assign(options, options_deprecated)
  }

  const url = resolveUrl(options)

  // If `hydrationCanBeAborted === false` (e.g. Vue) then we can apply navigate() only after hydration is done
  await firstRenderStartPromise

  const { keepScrollPosition, overwriteLastHistoryEntry, pageContext } = options
  const scrollTarget: ScrollTarget = { preserveScroll: keepScrollPosition ?? false }
  await renderPageClientSide({
    scrollTarget,
    urlOriginal: url,
    overwriteLastHistoryEntry,
    isBackwardNavigation: false,
    pageContextInitClient: pageContext
  })
}

// TODO/now: use everywhere where normalizeUrlArgument() is used?
function resolveUrl(options: Options): string {
  let url = normalizeUrlArgument(options.url ?? getCurrentUrl(), 'navigate')
  url = modifyUrlSameOrigin(url, options)
  return url
}

async function reload(): Promise<void> {
  await navigate(getCurrentUrl())
}
