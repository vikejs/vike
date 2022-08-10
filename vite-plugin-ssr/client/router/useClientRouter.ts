export { useClientRouter }
export { navigate }
export { disableClientRouting }

import {
  assert,
  assertUsage,
  getCurrentUrl,
  hasProp,
  isBrowser,
  isSameErrorMessage,
  objectAssign,
  serverSideRouteTo,
  throttle,
} from './utils'
import { navigationState } from '../navigationState'
import { getPageContext, getPageContextErrorPage } from './getPageContext'
import { releasePageContext } from '../releasePageContext'
import { getGlobalContext } from './getGlobalContext'
import { addComputedUrlProps } from '../../shared/addComputedUrlProps'
import { addLinkPrefetchHandlers } from './prefetch'
import { assertInfo, detectHydrationSkipSupport, PromiseType } from './utils'
import { assertRenderHook } from '../assertRenderHook'
import { assertHook } from '../../shared/getHook'
import { isClientSideRenderable, skipLink } from './skipLink'
import { isErrorFetchingStaticAssets } from '../loadPageFilesClientSide'
import { initHistoryState, getHistoryState, pushHistory, ScrollPosition, saveScrollPosition } from './history'
const navigateFnKey = '__vite_plugin_ssr__navigate'

setupNativeScrollRestoration()

initHistoryState()

let onPageTransitionStart: Function | undefined

let disabled = false
function disableClientRouting() {
  disabled = true
  assertInfo(
    false,
    `New deployed frontend detected. The next page navigation will use Server Routing instead of Client Routing.`,
    { onlyOnce: true },
  )
}

function useClientRouter() {
  autoSaveScrollPosition()

  onLinkClick((url: string, { keepScrollPosition }) => {
    const scrollTarget = keepScrollPosition ? 'preserve-scroll' : 'scroll-to-top-or-hash'
    fetchAndRender({ scrollTarget, url, isBackwardNavigation: false })
  })
  onBrowserHistoryNavigation((scrollTarget, isBackwardNavigation) => {
    fetchAndRender({ scrollTarget, isBackwardNavigation })
  })
  globalThis[navigateFnKey] = async (
    url: string,
    {
      keepScrollPosition,
      overwriteLastHistoryEntry,
    }: { keepScrollPosition: boolean; overwriteLastHistoryEntry: boolean },
  ) => {
    const scrollTarget = keepScrollPosition ? 'preserve-scroll' : 'scroll-to-top-or-hash'
    await fetchAndRender({ scrollTarget, url, overwriteLastHistoryEntry, isBackwardNavigation: false })
  }

  let renderingCounter = 0
  let renderPromise: Promise<void> | undefined
  let isTransitioning: boolean = false
  fetchAndRender({ scrollTarget: 'preserve-scroll', isBackwardNavigation: null })

  return

  async function fetchAndRender({
    scrollTarget,
    url = getCurrentUrl(),
    overwriteLastHistoryEntry = false,
    isBackwardNavigation,
  }: {
    scrollTarget: ScrollTarget
    url?: string
    overwriteLastHistoryEntry?: boolean
    isBackwardNavigation: boolean | null
  }): Promise<void> {
    if (disabled) {
      serverSideRouteTo(url)
      return
    }

    const pageContext = {
      url,
      isBackwardNavigation,
    }

    const renderingNumber = ++renderingCounter
    assert(renderingNumber >= 1)

    // Start transition before any await's
    if (renderingNumber > 1) {
      if (isTransitioning === false) {
        onPageTransitionStart?.(pageContext)
        isTransitioning = true
      }
    }

    const shouldAbort = () => {
      const ensureHydration = detectHydrationSkipSupport()

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
    const isFirstRenderAttempt = renderingNumber === 1
    objectAssign(pageContext, {
      _isFirstRenderAttempt: isFirstRenderAttempt,
    })
    objectAssign(pageContext, globalContext)
    addComputedUrlProps(pageContext)

    let pageContextAddendum: PromiseType<ReturnType<typeof getPageContext>>
    try {
      pageContextAddendum = await getPageContext(pageContext)
    } catch (err: unknown) {
      if (checkIfAbort(err, pageContext)) return

      console.error(err)

      try {
        pageContextAddendum = await getPageContextErrorPage(pageContext)
      } catch (err2: unknown) {
        // - When user hasn't defined a `_error.page.js` file
        // - Some unpexected vite-plugin-ssr internal error

        if (checkIfAbort(err2, pageContext)) return

        if (!isFirstRenderAttempt) {
          setTimeout(() => {
            // We let the server show the 404 page
            window.location.pathname = url
          }, 0)
        }

        if (!isSameErrorMessage(err, err2)) {
          throw err2
        } else {
          // Abort
          return
        }
      }
    }

    if (shouldAbort()) {
      return
    }
    objectAssign(pageContext, pageContextAddendum)
    assertHook(pageContext, 'onPageTransitionStart')
    onPageTransitionStart = pageContext.exports.onPageTransitionStart

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
      const pageContextReadyForRelease = releasePageContext(pageContext)
      assertRenderHook(pageContext)
      // We don't use a try-catch wrapper because rendering errors are usually handled by the UI framework. (E.g. React's Error Boundaries.)
      const hookResult = await pageContext.exports.render(pageContextReadyForRelease)
      assertUsage(
        hookResult === undefined,
        '`export { render }` of ' + pageContext.exportsAll.render![0]!._filePath + ' should not return any value',
      )
      addLinkPrefetchHandlers(pageContext)
    })()
    await renderPromise
    renderPromise = undefined

    if (pageContext._isFirstRenderAttempt) {
      assertHook(pageContext, 'onHydrationEnd')
      await pageContext.exports.onHydrationEnd?.(pageContext)
    } else if (renderingNumber === renderingCounter) {
      if (pageContext.exports.onPageTransitionEnd) {
        assertHook(pageContext, 'onPageTransitionEnd')
        pageContext.exports.onPageTransitionEnd(pageContext)
      }
      isTransitioning = false
    }

    setScrollPosition(scrollTarget)
    browserNativeScrollRestoration_disable()
    initialRenderIsDone = true
  }
}

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
  const navigateFunction = globalThis[navigateFnKey]
  assert(navigateFunction)
  await navigateFunction(url, { keepScrollPosition, overwriteLastHistoryEntry })
}

function onLinkClick(callback: (url: string, { keepScrollPosition }: { keepScrollPosition: boolean }) => void) {
  document.addEventListener('click', onClick)

  return

  // Code adapted from https://github.com/HenrikJoreteg/internal-nav-helper/blob/5199ec5448d0b0db7ec63cf76d88fa6cad878b7d/src/index.js#L11-L29

  async function onClick(ev: MouseEvent) {
    if (!isNormalLeftClick(ev)) return

    const linkTag = findLinkTag(ev.target as HTMLElement)
    if (!linkTag) return

    const url = linkTag.getAttribute('href')

    if (skipLink(linkTag)) return
    assert(url)
    ev.preventDefault()
    if (!(await isClientSideRenderable(url))) {
      serverSideRouteTo(url)
      return
    }

    const keepScrollPosition = ![null, 'false'].includes(linkTag.getAttribute('keep-scroll-position'))

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

let previousState = getState()
function onBrowserHistoryNavigation(callback: (scrollPosition: ScrollTarget, isBackwardNavigation: boolean) => void) {
  window.addEventListener('popstate', (ev) => {
    const { historyState, urlWithoutHash } = getState()

    // The History API doens't provide the previous state (the popped state)
    // https://stackoverflow.com/questions/48055323/is-history-state-always-the-same-as-popstate-event-state
    assert(historyState === ev.state)

    // Skip hash changes
    if (urlWithoutHash === previousState.urlWithoutHash) {
      return
    }

    const isBackwardNavigation = historyState.timestamp < previousState.historyState.timestamp

    previousState = {
      urlWithoutHash,
      historyState,
    }

    const scrollPosition = historyState.scrollPosition
    const scrollTarget = scrollPosition || 'scroll-to-top-or-hash'
    callback(scrollTarget, isBackwardNavigation)
  })
}

function changeUrl(url: string, overwriteLastHistoryEntry: boolean) {
  if (getCurrentUrl() === url) return
  browserNativeScrollRestoration_disable()
  pushHistory(url, overwriteLastHistoryEntry)
  previousState = getState()
}

function getState() {
  return {
    urlWithoutHash: getCurrentUrl({ withoutHash: true }),
    historyState: getHistoryState(),
  }
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

function autoSaveScrollPosition() {
  // Safari cannot handle more than 100 `history.replaceState()` calls within 30 seconds (https://github.com/brillout/vite-plugin-ssr/issues/46)
  window.addEventListener('scroll', throttle(saveScrollPosition, Math.ceil(1000 / 3)), { passive: true })
  onPageHide(saveScrollPosition)
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
  var __vite_plugin_ssr__navigate:
    | undefined
    | ((
        url: string,
        {
          keepScrollPosition,
          overwriteLastHistoryEntry,
        }: { keepScrollPosition: boolean; overwriteLastHistoryEntry: boolean },
      ) => Promise<void>)
}

function checkIfAbort(err: unknown, pageContext: { url: string; _isFirstRenderAttempt: boolean }): boolean {
  if ((err as any)?._abortRendering) return true

  if (handleErrorFetchingStaticAssets(err, pageContext)) {
    return true
  }

  return false
}

function handleErrorFetchingStaticAssets(
  err: unknown,
  pageContext: { url: string; _isFirstRenderAttempt: boolean },
): boolean {
  if (!isErrorFetchingStaticAssets(err)) {
    return false
  }

  disableClientRouting()

  if (pageContext._isFirstRenderAttempt) {
    // This may happen if the frontend was newly deployed during hydration.
    // Ideally: re-try a couple of times by reloading the page (not entirely trivial to implement since `localStorage` is needed.)
    throw err
  }

  serverSideRouteTo(pageContext.url)

  return true
}
