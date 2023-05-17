export { addLinkPrefetchHandlers, prefetch }

import { assert, assertClientRouting, assertUsage, checkIfClientRouting, isExternalLink } from './utils'
import { isErrorFetchingStaticAssets, loadPageFilesClientSide } from '../loadPageFilesClientSide'
import { isClientSideRoutable, skipLink } from './skipLink'
import { getPageId } from './getPageId'
import { getPrefetchSettings } from './prefetch/getPrefetchSettings'
import { isAlreadyPrefetched, markAsAlreadyPrefetched } from './prefetch/alreadyPrefetched'
import { disableClientRouting } from './useClientRouter'

assertClientRouting()

const linkPrefetchHandlerAdded = new Map<HTMLElement, true>()

async function prefetch(url: string): Promise<void> {
  assertUsage(
    checkIfClientRouting(),
    'prefetch() only works with Client Routing, see https://vite-plugin-ssr.com/prefetch'
  )
  assertUsage(
    !isExternalLink(url),
    `You are trying to prefetch the URL ${url} of another domain which cannot be prefetched`
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
  urlOriginal: string
}) {
  // Current URL is already prefetched
  markAsAlreadyPrefetched(pageContext.urlOriginal)

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
      // If a route() hook has a bug or `throw RenderErrorPage()`
      return
    }

    if (isAlreadyPrefetched(url)) return

    const { prefetchStaticAssets } = getPrefetchSettings(pageContext, linkTag)

    if (!prefetchStaticAssets) {
      return
    } else if (prefetchStaticAssets.when === 'HOVER') {
      linkTag.addEventListener('mouseover', () => prefetch(url))
      linkTag.addEventListener('touchstart', () => prefetch(url), { passive: true })
    } else if (prefetchStaticAssets.when === 'VIEWPORT') {
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
