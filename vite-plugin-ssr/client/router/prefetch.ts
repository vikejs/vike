export { addLinkPrefetchHandlers, prefetch }

import { assert, assertUsage } from './utils'
import { isExternalLink } from './utils/isExternalLink'
import { loadPageFilesClientSide } from '../../shared/getPageFiles/analyzePageClientSide/loadPageFilesClientSide'
import { isClientSideRenderable, skipLink } from './skipLink'
import { getPageId } from './getPageId'
import { disableClientRouting } from './useClientRouter'
import { getPrefetchConfig } from './prefetch/getPrefetchConfig'
import { isAlreadyPrefetched, markAsAlreadyPrefetched } from './prefetch/alreadyPrefetched'

const linkPrefetchHandlerAdded = new Map<HTMLElement, true>()

async function prefetch(url: string): Promise<void> {
  assertUsage(
    !isExternalLink(url),
    `You are trying to prefetch ${url} which is an external URL. This doesn't make sense since vite-plugin-ssr cannot prefetch external links.`,
  )

  if (isAlreadyPrefetched(url)) return
  markAsAlreadyPrefetched(url)

  const { pageId, pageFilesAll } = await getPageId(url)
  if (pageId) {
    try {
      await loadPageFilesClientSide(pageFilesAll, pageId)
    } catch (err) {
      disableClientRouting()
      throw err
    }
  }
}

function addLinkPrefetchHandlers(pageContext: {
  exports: Record<string, unknown>
  _isProduction: boolean
  url: string
}) {
  // Current URL is already prefetched
  markAsAlreadyPrefetched(pageContext.url)

  const linkTags = [...document.getElementsByTagName('A')] as HTMLElement[]
  linkTags.forEach(async (linkTag) => {
    if (linkPrefetchHandlerAdded.has(linkTag)) return
    linkPrefetchHandlerAdded.set(linkTag, true)

    const url = linkTag.getAttribute('href')

    if (skipLink(linkTag)) return
    assert(url)
    if (!(await isClientSideRenderable(url))) return

    if (isAlreadyPrefetched(url)) return

    const prefetchConfig = getPrefetchConfig(pageContext, linkTag)

    if (!prefetchConfig.prefetchStaticAssets) {
      return
    } else if (prefetchConfig.prefetchStaticAssets.when === 'HOVER') {
      linkTag.addEventListener('mouseover', () => prefetch(url))
      linkTag.addEventListener('touchstart', () => prefetch(url), { passive: true })
    } else if (prefetchConfig.prefetchStaticAssets.when === 'VIEWPORT') {
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
