import { assert, assertUsage, getUrlPathname, skipLink } from './utils'
import { route } from '../../shared/route'
import { addComputedUrlProps } from '../../shared/addComputedUrlProps'
import { getGlobalContext } from './getGlobalContext'
import { isExternalLink } from './utils/isExternalLink'
import { loadPageFiles2 } from '../../shared/getPageFiles'

export { addLinkPrefetchHandlers, prefetch }

const linkAlreadyPrefetched = new Map<string, true>()
const linkPrefetchHandlerAdded = new Map<HTMLElement, true>()

async function prefetch(url: string): Promise<void> {
  assertUsage(
    !isExternalLink(url),
    `You are trying to prefetch ${url} which is an external URL. This doesn't make sense since vite-plugin-ssr cannot prefetch external links.`,
  )

  if (isAlreadyPrefetched(url)) return
  markAsAlreadyPrefetched(url)

  const globalContext = await getGlobalContext()
  const pageContext = {
    url,
    ...globalContext,
  }
  addComputedUrlProps(pageContext)
  const routeContext = await route(pageContext)
  if ('pageContextAddendum' in routeContext) {
    const pageId = routeContext.pageContextAddendum._pageId
    if (pageId) {
      await loadPageFiles2(globalContext._pageFilesAll, pageId, true)
    }
  }
}

function addLinkPrefetchHandlers(prefetchOption: boolean, currentUrl: string) {
  // Current URL is already prefetched
  markAsAlreadyPrefetched(currentUrl)

  const linkTags = [...document.getElementsByTagName('A')] as HTMLElement[]
  linkTags.forEach(async (linkTag) => {
    if (linkPrefetchHandlerAdded.has(linkTag)) return
    linkPrefetchHandlerAdded.set(linkTag, true)

    const url = linkTag.getAttribute('href')

    if (skipLink(linkTag)) return
    assert(url) // `skipLink()` returns `true` otherwise

    if (isAlreadyPrefetched(url)) return

    let prefetchOptionWithOverride = getPrefetchAttribute(linkTag)
    if (prefetchOptionWithOverride === null) {
      prefetchOptionWithOverride = prefetchOption
    }
    assert([true, false].includes(prefetchOptionWithOverride))

    if (prefetchOptionWithOverride) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetch(url)
            observer.disconnect()
          }
        })
      })
      observer.observe(linkTag)
    } else {
      linkTag.addEventListener('mouseover', () => prefetch(url))
      linkTag.addEventListener('touchstart', () => prefetch(url), {passive: true})
    }
  })
}

function isAlreadyPrefetched(url: string): boolean {
  const prefetchUrl = getPrefetchUrl(url)
  return linkAlreadyPrefetched.has(prefetchUrl)
}
function markAsAlreadyPrefetched(url: string): void {
  const prefetchUrl = getPrefetchUrl(url)
  linkAlreadyPrefetched.set(prefetchUrl, true)
}
function getPrefetchUrl(url: string) {
  return getUrlPathname(url)
}

function getPrefetchAttribute(linkTag: HTMLElement): boolean | null {
  const prefetchAttribute = linkTag.getAttribute('data-prefetch')

  if (prefetchAttribute === null) return null
  assert(typeof prefetchAttribute === 'string')

  if (prefetchAttribute === 'true') {
    return true
  }
  if (prefetchAttribute === 'false') {
    return false
  }

  assertUsage(false, `Wrong data-prefetch value: \`"${prefetchAttribute}"\`; it should be \`"true"\` or \`"false"\`.`)
}
