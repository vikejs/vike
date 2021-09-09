import {
  assert,
  assertUsage,
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

export { useClientRouter }
export { navigate }

setupNativeScrollRestoration()

let isAlreadyCalled: boolean = false
let isFirstPageRender: boolean = true
const urlFullOriginal = getUrlFull()

function useClientRouter({
  render,
  onTransitionStart,
  onTransitionEnd
}: {
  // Minimal reproduction: https://www.typescriptlang.org/play?target=5&ts=4.2.3#code/C4TwDgpgBAYgdlAvFAFAQwE4HMBcUDeA2gNYQh4DOwGAlnFgLp5pwgC+AlEgHxQBuAexoATALAAoCQBsIwKADM4eeBImKkqAQCMAVngBKEAMYCMwgDxVa9ADRQWIXgDICaPHACuAWy0QMnHgITOAoBGQA6KQEsFG0dcLQONgBuVUlxUEgoAHkNQxMzS2o6LDsHbglgqigBAEYDY1MLKxKy1mcCLXdvX38NfC6oACY2SoEQuQEhvFzkOqA
  // render: (pageContext: { Page: any; isHydration: boolean, routeParams: Record<string, string } & Record<string, any>) => Promise<void> | void
  // render: (pageContext: Record<string, any>) => Promise<void> | void
  render: (pageContext: any) => Promise<void> | void
  onTransitionStart: () => void
  onTransitionEnd: () => void
}): {
  hydrationPromise: Promise<void>
} {
  assertUsage(isAlreadyCalled === false, '`useClientRouter` can be called only once.')
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
    const callNumber = ++callCount

    if (!isFirstPageRender) {
      if (isTransitioning === false) {
        onTransitionStart()
        isTransitioning = true
      }
    }

    const pageContext = await getPageContext(url, navigationState.noNavigationChangeYet)
    const pageFiles = await loadPageFiles(pageContext)
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
    renderPromise = (async () => {
      objectAssign(pageContext, { isHydration: isFirstPageRender && url === urlFullOriginal })
      const pageContextProxy = releasePageContext(pageContext)
      await render(pageContextProxy)
    })()
    await renderPromise
    renderPromise = undefined

    if (isFirstPageRender) {
      resolveInitialPagePromise()
    } else if (callNumber === callCount) {
      onTransitionEnd()
      isTransitioning = false
    }
    isFirstPageRender = false

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

  function isExternalLink(url: string) {
    return !url.startsWith('/') && !url.startsWith('.')
  }

  function isHashLink(url: string) {
    return url.includes('#')
  }

  function isNotNewTabLink(linkTag: HTMLElement) {
    const target = linkTag.getAttribute('target')
    const rel = linkTag.getAttribute('rel')
    return target !== '_blank' && target !== '_external' && rel !== 'external' && !linkTag.hasAttribute('download')
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
