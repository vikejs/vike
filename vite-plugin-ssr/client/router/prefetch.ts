import { assertUsage } from '../../shared/utils'
import { route } from '../../shared/route'
import { addComputedUrlProps } from '../../shared/addComputedurlProps'
import { getGlobalContext } from './getGlobalContext'
import { navigationState } from '../navigationState'
import { loadPageFiles } from '../loadPageFiles'
import { isExternalLink } from './utils/isExternalLink'
import { isNotNewTabLink } from './utils/isNotNewTabLink'

export { addLinkPrefetchHandlers, prefetch }

const linkAlreadyPrefetched = new Map<string, true>()

async function prefetch(url: string): Promise<void> {
  assertUsage(
    !isExternalLink(url),
    `You are trying to prefetch ${url} which is an external URL. This doesn't make sense since vite-plugin-ssr cannot prefetch external links.`
  )

  if (isAlreadyPrefetched(url)) return
  markAsAlreadyPrefetched(url)

  const globalContext = await getGlobalContext()
  const pageContext = {
    url,
    _noNavigationnChangeYet: navigationState.noNavigationChangeYet,
    ...globalContext
  }
  addComputedUrlProps(pageContext)
  const routeContext = await route(pageContext)
  if ('pageContextAddendum' in routeContext) {
    const _pageId = routeContext.pageContextAddendum._pageId
    if (_pageId) {
      loadPageFiles({ _pageId })
    }
  }
}

function addLinkPrefetchHandlers(prefetchOption: boolean, currentUrl: string) {
  // Current URL is already prefetched
  markAsAlreadyPrefetched(currentUrl)

  const linkTags = [...document.getElementsByTagName('A')] as HTMLElement[]
  linkTags.forEach(async (linkTag) => {
    const url = linkTag.getAttribute('href')

    if (!url) return
    if (!isNotNewTabLink(linkTag)) return
    if (isExternalLink(url)) return
    if (isAlreadyPrefetched(url)) return

    const prefetchOptionWithOverride = getPrefetchOverride(prefetchOption, linkTag)
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
      linkTag.addEventListener('touchstart', () => prefetch(url))
    }
  })

  function getPrefetchOverride(prefetchOption: boolean, linkTag: HTMLElement): boolean {
    const prefetchAttribute = linkTag.getAttribute('data-prefetch')
    if (typeof prefetchAttribute === 'string') {
      const options = ['true', 'false']
      assertUsage(
        options.includes(prefetchAttribute),
        `data-prefetch got invalid value: "${prefetchAttribute}", available options: ${options
          .map((v) => `"${v}"`)
          .join(', ')}`
      )
    }
    if (prefetchAttribute === 'true') {
      return true
    } else if (prefetchAttribute === 'false') {
      return false
    }

    return prefetchOption
  }
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
  return url.split('?')[0]?.split('#')[0] || ''
}
