export { prefetch }
export { addLinkPrefetchHandlers }

import { assert, assertClientRouting, assertUsage, checkIfClientRouting } from './utils'
import { isErrorFetchingStaticAssets, loadPageFilesClientSide } from '../loadPageFilesClientSide'
import { isClientSideRoutable, skipLink } from './skipLink'
import { getPageId } from './getPageId'
import { getPrefetchSettings } from './prefetch/getPrefetchSettings'
import { isAlreadyPrefetched, markAsAlreadyPrefetched } from './prefetch/alreadyPrefetched'
import { disableClientRouting } from './useClientRouter'
import { isExternalLink } from './isExternalLink'

assertClientRouting()

const linkPrefetchHandlerAdded = new Map<HTMLElement, true>()

/**
 * Programmatically prefetch client assets.
 *
 * https://vite-plugin-ssr.com/prefetch
 *
 * @param url - The URL of the page you want to prefetch.
 */
async function prefetch(url: string): Promise<void> {
  assertUsage(
    checkIfClientRouting(),
    'prefetch() only works with Client Routing, see https://vite-plugin-ssr.com/prefetch',
    { showStackTrace: true }
  )
  assertUsage(
    !isExternalLink(url),
    `You are trying to prefetch the URL ${url} of another domain which cannot be prefetched`,
    { showStackTrace: true }
  )

  if (isAlreadyPrefetched(url)) return
  markAsAlreadyPrefetched(url)

  const { pageId, pageFilesAll, pageConfigs } = await getPageId(url)
  if (pageId) {
    try {
      await loadPageFilesClientSide(pageFilesAll, pageConfigs, pageId)
    } catch (err) {
      if (isErrorFetchingStaticAssets(err)) {
        disableClientRouting(err, true)
      } else {
        throw err
      }
    }
  }
}

function addLinkPrefetchHandlers(pageContext: {
  exports: Record<string, unknown>
  _isProduction: boolean
  urlPathname: string
}) {
  // Current URL is already prefetched
  markAsAlreadyPrefetched(pageContext.urlPathname)

  const linkTags = [...document.getElementsByTagName('A')] as HTMLElement[]
  linkTags.forEach(async (linkTag) => {
    if (linkPrefetchHandlerAdded.has(linkTag)) return
    linkPrefetchHandlerAdded.set(linkTag, true)

    const url = linkTag.getAttribute('href')

    if (skipLink(linkTag)) return
    assert(url)
    try {
      if (!(await isClientSideRoutable(url))) return
    } catch {
      // If a route() hook has a bug or `throw render()` / `throw redirect()`
      return
    }

    if (isAlreadyPrefetched(url)) return

    const { prefetchStaticAssets } = getPrefetchSettings(pageContext, linkTag)

    if (!prefetchStaticAssets) {
      return
    } else if (prefetchStaticAssets === 'hover') {
      linkTag.addEventListener('mouseover', () => prefetch(url))
      linkTag.addEventListener('touchstart', () => prefetch(url), { passive: true })
    } else if (prefetchStaticAssets === 'viewport') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetch(url)
            observer.disconnect()
          }
        })
      })
      observer.observe(linkTag)
    }
  })
}
