import {
  assert,
  assertUsage,
  getUrlFull,
  getUrlFullWithoutHash,
  hasProp,
  isBrowser,
  objectAssign,
  throttle,
  skipLink,
} from './utils'
import { navigationState } from '../navigationState'
import { getPageContext } from './getPageContext'
import { releasePageContext } from '../releasePageContext'
import { getGlobalContext } from './getGlobalContext'
import { addComputedUrlProps } from '../../shared/addComputedUrlProps'
import { addLinkPrefetchHandlers } from './prefetch'
import { detectHydrationSkipSupport } from './utils/detectHydrationSkipSupport'

export { useClientRouter }
export { navigate }

setupNativeScrollRestoration()

let onPageTransitionStart: Function | null

function useClientRouter() {
  autoSaveScrollPosition()

  onLinkClick((url: string, { keepScrollPosition }) => {
    const scrollTarget = keepScrollPosition ? 'preserve-scroll' : 'scroll-to-top-or-hash'
    fetchAndRender(scrollTarget, url)
  })
  onBrowserHistoryNavigation((scrollTarget) => {
    fetchAndRender(scrollTarget)
  })
  navigateFunction = async (
    url: string,
    {
      keepScrollPosition,
      overwriteLastHistoryEntry,
    }: { keepScrollPosition: boolean; overwriteLastHistoryEntry: boolean },
  ) => {
    const scrollTarget = keepScrollPosition ? 'preserve-scroll' : 'scroll-to-top-or-hash'
    await fetchAndRender(scrollTarget, url, overwriteLastHistoryEntry)
  }

  let resolveInitialPagePromise: () => void
  const hydrationPromise = new Promise<void>((resolve) => (resolveInitialPagePromise = resolve))

  let renderingCounter = 0
  let renderPromise: Promise<void> | undefined
  let isTransitioning: boolean = false
  fetchAndRender('preserve-scroll')

  return { hydrationPromise }

  async function fetchAndRender(
    scrollTarget: ScrollTarget,
    url: string = getUrlFull(),
    overwriteLastHistoryEntry = false,
  ): Promise<void> {
    const renderingNumber = ++renderingCounter
    assert(renderingNumber >= 1)

    // Start transition before any await's
    if (renderingNumber > 1) {
      if (isTransitioning === false) {
        if (onPageTransitionStart) {
          onPageTransitionStart()
        }
        isTransitioning = true
      }
    }

    const ensureHydration = detectHydrationSkipSupport()
    if (ensureHydration) {
      if (renderingNumber > 1) {
        await hydrationPromise
      }
    }

    const shouldAbort = () => {
      // We should never abort the hydration if `ensureHydration: true`
      if (ensureHydration && renderingNumber === 1) {
        return false
      }
      // If there is a newer rendering, we should abort all previous renderings
      if (renderingNumber !== renderingCounter) {
        return true
      }
      return false
    }

    const globalContext = await getGlobalContext()
    if (shouldAbort()) {
      return
    }
    const pageContext = {
      url,
      _isFirstRender: renderingNumber === 1,
      ...globalContext,
    }
    addComputedUrlProps(pageContext)

    const pageContextAddendum = await getPageContext(pageContext)
    if (shouldAbort()) {
      return
    }
    objectAssign(pageContext, pageContextAddendum)
    if ('onPageTransitionStart' in pageContext.exports) {
      assertUsage(
        hasProp(pageContext.exports, 'onPageTransitionStart', 'function'),
        'The `export { onPageTransitionStart }` of ' +
          pageContext.exportsAll.onPageTransitionStart![0]!.filePath +
          ' should be a function.',
      )
      onPageTransitionStart = pageContext.exports.onPageTransitionStart
    }

    if (renderPromise) {
      // Always make sure that the previous render has finished,
      // otherwise that previous render may finish after this one.
      await renderPromise
    }
    if (shouldAbort()) {
      return
    }

    changeUrl(url, overwriteLastHistoryEntry)
    navigationState.markNavigationChange()
    assert(renderPromise === undefined)
    renderPromise = (async () => {
      // @ts-ignore TODO
      const pageContextReadyForRelease = releasePageContext(pageContext)
      if (!hasProp(pageContext.exports, 'render')) {
        const pageFilesClient = pageContext._pageFilesAll.filter(
          (p) => p.fileType === '.page.client' && (p.isDefaultPageFile || p.pageId === pageContext._pageId),
        )
        let errMsg: string
        if (pageFilesClient.length === 0) {
          errMsg = 'No file `*.page.client.*` found for URL ' + pageContext.url
        } else {
          errMsg =
            'One of the following files should export a `render()` hook: ' +
            pageFilesClient.map((p) => p.filePath).join(' ')
        }
        assertUsage(false, errMsg)
      }
      assertUsage(
        hasProp(pageContext.exports, 'render', 'function'),
        'The `export { render }` of ' + pageContext.exportsAll.render![0]!.filePath + ' should be a function',
      )
      const hookResult = await pageContext.exports.render(pageContextReadyForRelease)
      assertUsage(
        hookResult === undefined,
        'The `export { render }` of ' + pageContext.exportsAll.render![0]!.filePath + ' should not return any value',
      )
      addLinkPrefetchHandlers(!!pageContext.exports?.prefetchLinks, url)
    })()
    await renderPromise
    renderPromise = undefined

    if (pageContext._isFirstRender) {
      resolveInitialPagePromise()
    } else if (renderingNumber === renderingCounter) {
      if (pageContext.exports.onPageTransitionEnd) {
        assertUsage(
          hasProp(pageContext.exports, 'onPageTransitionEnd', 'function'),
          'The `export { onPageTransitionEnd }` of ' +
            pageContext.exportsAll.onPageTransitionEnd![0]!.filePath +
            ' should be a function.',
        )
        pageContext.exports.onPageTransitionEnd()
      }
      isTransitioning = false
    }

    setScrollPosition(scrollTarget)
    browserNativeScrollRestoration_disable()
    initialRenderIsDone = true
  }
}

let navigateFunction:
  | undefined
  | ((
      url: string,
      {
        keepScrollPosition,
        overwriteLastHistoryEntry,
      }: { keepScrollPosition: boolean; overwriteLastHistoryEntry: boolean },
    ) => Promise<void>)
async function navigate(
  url: string,
  { keepScrollPosition = false, overwriteLastHistoryEntry = false } = {},
): Promise<void> {
  assertUsage(
    isBrowser(),
    '[`navigate(url)`] The `navigate(url)` function is only callable in the browser but you are calling it in Node.js.',
  )
  assertUsage(url, '[navigate(url)] Missing argument `url`.')
  assertUsage(
    typeof url === 'string',
    '[navigate(url)] Argument `url` should be a string (but we got `typeof url === "' + typeof url + '"`.',
  )
  assertUsage(
    typeof keepScrollPosition === 'boolean',
    '[navigate(url, { keepScrollPosition })] Argument `keepScrollPosition` should be a boolean (but we got `typeof keepScrollPosition === "' +
      typeof keepScrollPosition +
      '"`.',
  )
  assertUsage(
    typeof overwriteLastHistoryEntry === 'boolean',
    '[navigate(url, { overwriteLastHistoryEntry })] Argument `overwriteLastHistoryEntry` should be a boolean (but we got `typeof keepScrollPosition === "' +
      typeof overwriteLastHistoryEntry +
      '"`.',
  )
  assertUsage(url.startsWith('/'), '[navigate(url)] Argument `url` should start with a leading `/`.')
  assertUsage(
    navigateFunction,
    '[navigate()] You need to call `useClientRouter()` before being able to use `navigate()`.',
  )
  await navigateFunction(url, { keepScrollPosition, overwriteLastHistoryEntry })
}

function onLinkClick(callback: (url: string, { keepScrollPosition }: { keepScrollPosition: boolean }) => void) {
  document.addEventListener('click', onClick)

  return

  // Code adapted from https://github.com/HenrikJoreteg/internal-nav-helper/blob/5199ec5448d0b0db7ec63cf76d88fa6cad878b7d/src/index.js#L11-L29

  function onClick(ev: MouseEvent) {
    if (!isNormalLeftClick(ev)) return

    const linkTag = findLinkTag(ev.target as HTMLElement)
    if (!linkTag) return

    const url = linkTag.getAttribute('href')

    if (skipLink(linkTag)) return
    assert(url) // `skipLink()` returns `true` otherwise

    const keepScrollPosition = ![null, 'false'].includes(linkTag.getAttribute('keep-scroll-position'))

    ev.preventDefault()
    callback(url, { keepScrollPosition })
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

function changeUrl(url: string, overwriteLastHistoryEntry: boolean) {
  if (getUrlFull() === url) return
  browserNativeScrollRestoration_disable()
  if (!overwriteLastHistoryEntry) {
    window.history.pushState(undefined, '', url)
  } else {
    window.history.replaceState(undefined, '', url)
  }
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
declare global {
  interface Window {
    __VUE__?: true
  }
}
