import { assertUsage } from '../../shared/utils'
import { route } from '../../shared/route'
import { addComputedUrlProps } from '../../shared/addComputedurlProps'
import { getGlobalContext } from './getGlobalContext'
import { navigationState } from '../navigationState'
import { loadPageFiles } from '../loadPageFiles'
import { isExternalLink } from './utils/isExternalLink'
import { isNotNewTabLink } from './utils/isNotNewTabLink'

export { addLinkPrefetch, prefetch, PrefetchStrategy }

type PrefetchStrategy = typeof prefetchStrategies[number]

const prefetchStrategies = ['inViewport','onHover'] as const
const prefetchLinksHandled = new Map<string, boolean>()

async function prefetch(url: string) {
  //TODO enable only in production: if(import.meta.env.DEV) return
  const prefetchUrl = getPrefetchUrl(url)
  if(!shouldPrefetch(prefetchUrl)) return
  prefetchLinksHandled.set(prefetchUrl, true)
  const globalContext = await getGlobalContext()
  const pageContext = {
    url,
    _noNavigationnChangeYet: navigationState.noNavigationChangeYet,
    ...globalContext
  }
  addComputedUrlProps(pageContext)
  const routeContext = await route(pageContext)
  if('pageContextAddendum' in routeContext) {
    const _pageId = routeContext.pageContextAddendum._pageId
    if(_pageId) {
      loadPageFiles({_pageId})
    }
  }
}

function addLinkPrefetch(strategy: PrefetchStrategy, currentUrl: string) {
  // no need to add listeners on current url links
  prefetchLinksHandled.set(getPrefetchUrl(currentUrl), true)
  const linkTags = [...document.getElementsByTagName('A')] as HTMLElement[]
  linkTags.forEach(async (v) => {
    const url = v.getAttribute('href')
    if(url && isNotNewTabLink(v)) {
      const prefetchUrl = getPrefetchUrl(url)
      if(!shouldPrefetch(prefetchUrl)) return
      const override = v.getAttribute('data-prefetch')
      if(typeof override === 'string') {
        assertUsage(prefetchStrategies.includes(override as PrefetchStrategy), `data-prefetch got invalid value: "${override}"`)
      }
      const strategyWithOverride = override || strategy
      if(strategyWithOverride === 'inViewport') {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if(entry.isIntersecting) {
              onVisible(url)
              observer.disconnect()
            }
          })
        })
        observer.observe(v)
      } else if(strategyWithOverride === 'onHover') {
        v.addEventListener('mouseover', () => onVisible(url))
        v.addEventListener('touchstart', () => onVisible(url))
      }
    }
  })

  function onVisible(url: string) {
    prefetch(url)
  }
}

function getPrefetchUrl(url: string) {
  return url.split('?')[0]?.split('#')[0] || ''
}

function shouldPrefetch(prefetchUrl: string) {
  if(isExternalLink(prefetchUrl)) return false
  if(prefetchLinksHandled.has(prefetchUrl)) return false

  return true
}
