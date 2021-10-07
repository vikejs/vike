import {
  assert,
  assertUsage,
  assertWarning,
  getUrlFull,
  getUrlFullWithoutHash,
  hasProp,
  isBrowser,
  objectAssign
} from '../../shared/utils'
import { navigationState } from '../navigationState'
import { throttle } from '../../shared/utils/throttle'
import { getPageContext } from './getPageContext'
import { loadPageFiles } from '../loadPageFiles'
import { releasePageContext } from '../releasePageContext'
import { getGlobalContext } from './getGlobalContext'
import { addComputedUrlProps } from '../../shared/addComputedurlProps'
import { route } from '../../shared/route'

export { useClientRouter }
export { navigate }
export { prefetchUrl }

setupNativeScrollRestoration()

let isAlreadyCalled: boolean = false
let isFirstPageRender: boolean = true

type PrefetchStrategy = 'inViewport' | 'onHover'

function useClientRouter({
  render,
  ensureHydration = false,
  onTransitionStart,
  onTransitionEnd,
  prefetch = 'onHover'
}: {
  // Minimal reproduction: https://www.typescriptlang.org/play?target=5&ts=4.2.3#code/C4TwDgpgBAYgdlAvFAFAQwE4HMBcUDeA2gNYQh4DOwGAlnFgLp5pwgC+AlEgHxQBuAexoATALAAoCQBsIwKADM4eeBImKkqAQCMAVngBKEAMYCMwgDxVa9ADRQWIXgDICaPHACuAWy0QMnHgITOAoBGQA6KQEsFG0dcLQONgBuVUlxUEgoAHkNQxMzS2o6LDsHbglgqigBAEYDY1MLKxKy1mcCLXdvX38NfC6oACY2SoEQuQEhvFzkOqA
  // render: (pageContext: { Page: any; isHydration: boolean, routeParams: Record<string, string } & Record<string, any>) => Promise<void> | void
  // render: (pageContext: Record<string, any>) => Promise<void> | void
  render: (pageContext: any) => Promise<void> | void
  onTransitionStart: () => void
  onTransitionEnd: () => void
  ensureHydration?: boolean,
  prefetch?: PrefetchStrategy
}): {
  hydrationPromise: Promise<void>
} {
  assertUsage(isAlreadyCalled === false, '`useClientRouter` can be called only once.')
  assertWarning(
    !(isVueApp() && ensureHydration !== true),
    'You seem to be using Vue.js; we strongly recommend using the option `useClientRouter({ensureHydration: true})` to avoid "Hydration mismatch" errors.'
  )
  isAlreadyCalled = true
  autoSaveScrollPosition()

  onLinkClick((url: string, { keepScrollPosition }) => {
    const scrollTarget = keepScrollPosition ? 'preserve-scroll' : 'scroll-to-top-or-hash'
    fetchAndRender(scrollTarget, url)
  })
  onBrowserHistoryNavigation((scrollTarget) => {
    fetchAndRender(scrollTarget)
  })
  navigateFunction = async (url: string, { keepScrollPosition }: { keepScrollPosition: boolean }) => {
    const scrollTarget = keepScrollPosition ? 'preserve-scroll' : 'scroll-to-top-or-hash'
    await fetchAndRender(scrollTarget, url)
  }

  let resolveInitialPagePromise: () => void
  const hydrationPromise = new Promise<void>((resolve) => (resolveInitialPagePromise = resolve))

  let callCount = 0
  let renderPromise: Promise<void> | undefined
  let isTransitioning: boolean = false
  fetchAndRender('preserve-scroll')

  return { hydrationPromise }

  async function fetchAndRender(scrollTarget: ScrollTarget, url: string = getUrlFull()): Promise<void> {
    if (ensureHydration) {
      if (callCount !== 0) {
        await hydrationPromise
      }
    }
    const callNumber = ++callCount

    if (!isFirstPageRender) {
      if (isTransitioning === false) {
        onTransitionStart()
        isTransitioning = true
      }
    }

    const globalContext = await getGlobalContext()
    if (callNumber !== callCount) {
      // Abort since there is a newer call.
      return
    }
    const pageContext = {
      url,
      _noNavigationnChangeYet: navigationState.noNavigationChangeYet,
      ...globalContext
    }
    addComputedUrlProps(pageContext)

    const pageContextAddendum = await getPageContext(pageContext)
    if (callNumber !== callCount) {
      // Abort since there is a newer call.
      return
    }
    objectAssign(pageContext, pageContextAddendum)

    const pageFiles = await loadPageFiles(pageContext)
    if (callNumber !== callCount) {
      // Abort since there is a newer call.
      return
    }
    objectAssign(pageContext, pageFiles)

    if (renderPromise) {
      // Always make sure that the previous render has finished,
      // otherwise that previous render may finish after this one.
      await renderPromise
    }
    if (callNumber !== callCount) {
      // Abort since there is a newer call.
      return
    }

    changeUrl(url)
    navigationState.markNavigationChange()
    assert(renderPromise === undefined)
    const wasFirstPageRender = isFirstPageRender
    renderPromise = (async () => {
      const isHydration = isFirstPageRender && pageContext._pageContextComesFromHtml
      isFirstPageRender = false
      objectAssign(pageContext, { isHydration })
      const pageContextProxy = releasePageContext(pageContext)
      await render(pageContextProxy)
      if(import.meta.env.PROD) {
        addLinkPrefetch(prefetch)
      }
    })()
    await renderPromise
    renderPromise = undefined

    if (wasFirstPageRender) {
      resolveInitialPagePromise()
    } else if (callNumber === callCount) {
      onTransitionEnd()
      isTransitioning = false
    }

    setScrollPosition(scrollTarget)
    browserNativeScrollRestoration_disable()
    initialRenderIsDone = true
  }
}

let navigateFunction:
  | undefined
  | ((url: string, { keepScrollPosition }: { keepScrollPosition: boolean }) => Promise<void>)
async function navigate(url: string, { keepScrollPosition = false } = {}): Promise<void> {
  assertUsage(
    isBrowser(),
    '[`navigate(url)`] The `navigate(url)` function is only callable in the browser but you are calling it in Node.js.'
  )
  assertUsage(url, '[navigate(url)] Missing argument `url`.')
  assertUsage(
    typeof url === 'string',
    '[navigate(url)] Argument `url` should be a string (but we got `typeof url === "' + typeof url + '"`.'
  )
  assertUsage(
    typeof keepScrollPosition === 'boolean',
    '[navigate(url, { keepScrollPosition })] Argument `keepScrollPosition` should be a boolean (but we got `typeof keepScrollPosition === "' +
      typeof keepScrollPosition +
      '"`.'
  )
  assertUsage(url.startsWith('/'), '[navigate(url)] Argument `url` should start with a leading `/`.')
  assertUsage(
    navigateFunction,
    '[navigate()] You need to call `useClientRouter()` before being able to use `navigate()`.'
  )
  await navigateFunction(url, { keepScrollPosition })
}

async function prefetchUrl(url: string) {
    if(isExternalLink(url)) return
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

function addLinkPrefetch(strategy: PrefetchStrategy) {
  const linkTags = [...document.getElementsByTagName('A')] as HTMLElement[]
  linkTags.forEach(async (v) => {
    const url = v.getAttribute('href')
    if(url && isNotNewTabLink(v)) {
      if(strategy === 'inViewport') {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if(entry.isIntersecting) {
              prefetchUrl(url)
            }
          })
        })
        observer.observe(v)
      } else if(strategy === 'onHover') {
        v.addEventListener('mouseover', () => prefetchUrl(url))
        v.addEventListener('touchstart', () => prefetchUrl(url))
      }
    }
  })
}

function isExternalLink(url: string) {
  return !url.startsWith('/') && !url.startsWith('.')
}

function isNotNewTabLink(linkTag: HTMLElement) {
  const target = linkTag.getAttribute('target')
  const rel = linkTag.getAttribute('rel')
  return target !== '_blank' && target !== '_external' && rel !== 'external' && !linkTag.hasAttribute('download')
}

function onLinkClick(callback: (url: string, { keepScrollPosition }: { keepScrollPosition: boolean }) => void) {
  document.addEventListener('click', onClick)

  return

  // Code adapted from https://github.com/HenrikJoreteg/internal-nav-helper/blob/5199ec5448d0b0db7ec63cf76d88fa6cad878b7d/src/index.js#L11-L29

  function onClick(ev: MouseEvent) {
    if (!isNormalLeftClick(ev)) return

    const linkTag = findLinkTag(ev.target as HTMLElement)
    if (!linkTag) return
    if (!isNotNewTabLink(linkTag)) return

    const url = linkTag.getAttribute('href')

    if (!url) return
    if (isExternalLink(url)) return
    if (isHashLink(url)) return

    const keepScrollPosition = ![null, 'false'].includes(linkTag.getAttribute('keep-scroll-position'))

    ev.preventDefault()
    callback(url, { keepScrollPosition })
  }

  function isHashLink(url: string) {
    return url.includes('#')
  }

  function isNormalLeftClick(ev: MouseEvent): boolean {
    return ev.button === 0 && !ev.ctrlKey && !ev.shiftKey && !ev.altKey && !ev.metaKey
  }

  function findLinkTag(target: HTMLElement): null | HTMLElement {
    while (target.tagName !== 'A') {
      const { parentNode } = target
      if (!parentNode) {
        return null
      }
      target = parentNode as HTMLElement
    }
    return target
  }
}

let urlFullWithoutHash__previous = getUrlFullWithoutHash()
function onBrowserHistoryNavigation(callback: (scrollPosition: ScrollTarget) => void) {
  window.addEventListener('popstate', (ev) => {
    // Skip hash changes
    const urlFullWithoutHash__current = getUrlFullWithoutHash()
    if (urlFullWithoutHash__current == urlFullWithoutHash__previous) {
      return
    }
    urlFullWithoutHash__previous = urlFullWithoutHash__current

    const scrollPosition = getScrollPositionFromHistory(ev.state)
    const scrollTarget = scrollPosition || 'scroll-to-top-or-hash'
    callback(scrollTarget)
  })
}

function changeUrl(url: string) {
  if (getUrlFull() === url) return
  browserNativeScrollRestoration_disable()
  window.history.pushState(undefined, '', url)
  urlFullWithoutHash__previous = getUrlFullWithoutHash()
}

type ScrollPosition = { x: number; y: number }
function getScrollPosition(): ScrollPosition {
  const scrollPosition = { x: window.scrollX, y: window.scrollY }
  return scrollPosition
}
type ScrollTarget = ScrollPosition | 'scroll-to-top-or-hash' | 'preserve-scroll'
function setScrollPosition(scrollTarget: ScrollTarget): void {
  if (scrollTarget === 'preserve-scroll') {
    return
  }
  let scrollPosition: ScrollPosition
  if (scrollTarget === 'scroll-to-top-or-hash') {
    const hash = getUrlHash()
    // We mirror the browser's native behavior
    if (hash && hash !== 'top') {
      const hashTarget = document.getElementById(hash) || document.getElementsByName(hash)[0]
      if (hashTarget) {
        hashTarget.scrollIntoView()
        return
      }
    }
    scrollPosition = { x: 0, y: 0 }
  } else {
    assert('x' in scrollTarget && 'y' in scrollTarget)
    scrollPosition = scrollTarget
  }
  const { x, y } = scrollPosition
  window.scrollTo(x, y)
}

function getScrollPositionFromHistory(historyState: unknown = window.history.state) {
  return hasProp(historyState, 'scrollPosition') ? (historyState.scrollPosition as ScrollPosition) : null
}

function autoSaveScrollPosition() {
  // Safari cannot handle more than 100 `history.replaceState()` calls within 30 seconds (https://github.com/brillout/vite-plugin-ssr/issues/46)
  window.addEventListener('scroll', throttle(saveScrollPosition, 100), { passive: true })
  onPageHide(saveScrollPosition)
}
function saveScrollPosition() {
  // Save scroll position
  const scrollPosition = getScrollPosition()
  window.history.replaceState({ scrollPosition }, '')
}

function getUrlHash(): string | null {
  let { hash } = window.location
  if (hash === '') return null
  assert(hash.startsWith('#'))
  hash = hash.slice(1)
  return hash
}

let initialRenderIsDone: boolean = false
// We use the browser's native scroll restoration mechanism only for the first render
function setupNativeScrollRestoration() {
  browserNativeScrollRestoration_enable()
  onPageHide(browserNativeScrollRestoration_enable)
  onPageShow(() => initialRenderIsDone && browserNativeScrollRestoration_disable())
}
function browserNativeScrollRestoration_disable() {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
}
function browserNativeScrollRestoration_enable() {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'auto'
  }
}

function onPageHide(listener: () => void) {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      listener()
    }
  })
}
function onPageShow(listener: () => void) {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      listener()
    }
  })
}

function isVueApp() {
  return typeof window.__VUE__ !== 'undefined'
}
declare global {
  interface Window {
    __VUE__?: true
  }
}
