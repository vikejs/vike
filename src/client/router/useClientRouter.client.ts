import { assert, assertUsage, getUrlFull, getUrlFullWithoutHash, hasProp, isNodejs } from '../../utils'
import { getPageByUrl } from './getPageByUrl.client'
import { navigationState } from '../navigationState.client'
import { getContextPropsProxy } from '../getContextPropsProxy'
import { throttle } from '../../utils/throttle'

export { useClientRouter }
export { navigate }

let isAlreadyCalled: boolean = false
let isFirstPageRender: boolean = true
const urlFullOriginal = getUrlFull()

browserNativeScrollRestoration_enable()
onPageClose(browserNativeScrollRestoration_enable)

function useClientRouter({
  render,
  onTransitionStart,
  onTransitionEnd
}: {
  render: ({
    Page,
    contextProps,
    isHydration
  }: {
    Page: any
    contextProps: any
    isHydration: boolean
  }) => Promise<void> | void
  onTransitionStart: () => void
  onTransitionEnd: () => void
}): {
  hydrationPromise: Promise<void>
} {
  assertUsage(isAlreadyCalled === false, '`useClientRouter` can be called only once.')
  isAlreadyCalled = true
  autoSaveScrollPosition()

  onLinkClick((url: string) => {
    fetchAndRender(null, url)
  })
  onBrowserHistoryNavigation((scrollPosition) => {
    fetchAndRender(scrollPosition)
  })
  navigateFunction = async (url: string) => {
    await fetchAndRender(null, url)
  }

  let resolveInitialPagePromise: () => void
  const hydrationPromise = new Promise<void>((resolve) => (resolveInitialPagePromise = resolve))

  let callCount = 0
  let renderPromise: Promise<void> | undefined
  let isTransitioning: boolean = false
  fetchAndRender()

  return { hydrationPromise }

  async function fetchAndRender(
    scrollPosition: ScrollPosition | null | undefined = undefined,
    url: string = getUrlFull()
  ): Promise<undefined> {
    const callNumber = ++callCount

    if (!isFirstPageRender) {
      if (isTransitioning === false) {
        onTransitionStart()
        isTransitioning = true
      }
    }

    let { Page, contextProps } = await getPageByUrl(url, navigationState.noNavigationChangeYet)
    assert(contextProps.urlFull && contextProps.urlPathname)
    contextProps = getContextPropsProxy(contextProps)

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
      await render({
        Page,
        contextProps,
        isHydration: isFirstPageRender && url === urlFullOriginal,
        // @ts-ignore
        get pageProps() {
          assertUsage(
            false,
            "`pageProps` in `useClientRouter(({ pageProps }) => {})` has been replaced with `useClientRouter(({ contextProps }) => {})`. The `setPageProps()` hook is deprecated: instead, return `pageProps` in your `addContextProps()` hook and use `passToClient = ['pageProps']` to pass `context.pageProps` to the browser. See `BREAKING CHANGE` in `CHANGELOG.md`."
          )
        }
      })
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

    if (scrollPosition !== undefined) {
      setScrollPosition(scrollPosition)
    }
    browserNativeScrollRestoration_disable()
  }
}

let navigateFunction: undefined | ((url: string) => Promise<void>)
async function navigate(url: string): Promise<void> {
  assertUsage(
    !isNodejs(),
    '[`navigate(url)`] The `navigate(url)` function is only callable in the browser but you are calling it in Node.js.'
  )
  assertUsage(url, '[navigate(url)] Missing argument `url`.')
  assertUsage(
    typeof url === 'string',
    '[navigate(url)] Argument `url` should be a string (but we got `typeof url === "' + typeof url + '"`.'
  )
  assertUsage(url.startsWith('/'), '[navigate(url)] Argument `url` should start with a leading `/`.')
  assertUsage(
    navigateFunction,
    '[navigate()] You need to call `useClientRouter()` before being able to use `navigate()`.'
  )
  await navigateFunction(url)
}

function onLinkClick(callback: (url: string) => void) {
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

    ev.preventDefault()
    callback(url)
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
function onBrowserHistoryNavigation(callback: (scrollPosition: ScrollPosition | null) => void) {
  window.addEventListener('popstate', (ev) => {
    // Skip hash changes
    const urlFullWithoutHash__current = getUrlFullWithoutHash()
    if (urlFullWithoutHash__current == urlFullWithoutHash__previous) {
      return
    }
    urlFullWithoutHash__previous = urlFullWithoutHash__current

    const scrollPosition = getScrollPositionFromHistory(ev.state)
    callback(scrollPosition)
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
function setScrollPosition(scrollPosition: ScrollPosition | null): void {
  if (!scrollPosition) {
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
  onPageClose(saveScrollPosition)
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

function onPageClose(listener: () => void) {
  window.addEventListener('beforeunload', () => {
    listener()
  })
  window.addEventListener('unload', () => {
    listener()
  })
}
