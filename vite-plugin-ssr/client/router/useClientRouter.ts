export { useClientRouter }
export { disableClientRouting }
export { isDisableAutomaticLinkInterception }

import {
  assert,
  getCurrentUrl,
  isEquivalentError,
  objectAssign,
  serverSideRouteTo,
  throttle,
  sleep,
  getGlobalObject,
  executeHook,
  isObject
} from './utils'
import { navigationState } from '../navigationState'
import { checkIf404, getPageContext, getPageContextErrorPage } from './getPageContext'
import { createPageContext } from './createPageContext'
import { addLinkPrefetchHandlers } from './prefetch'
import { assertInfo, assertWarning, isReact, PromiseType } from './utils'
import { executeOnRenderClientHook } from '../executeOnRenderClientHook'
import { assertHook } from '../../shared/getHook'
import { isClientSideRoutable, skipLink } from './skipLink'
import { isErrorFetchingStaticAssets } from '../loadPageFilesClientSide'
import { initHistoryState, getHistoryState, pushHistory, ScrollPosition, saveScrollPosition } from './history'
import { defineNavigate } from './navigate'
import { getPageContextFromRewrite, isAbortError, logAbortErrorHandled, PageContextFromRewrite } from '../../shared/route/RenderAbort'
const globalObject = getGlobalObject<{
  onPageTransitionStart?: Function
  clientRoutingIsDisabled?: true
  previousState: ReturnType<typeof getState>
  initialRenderIsDone?: true
}>('useClientRouter.ts', { previousState: getState() })

setupNativeScrollRestoration()
initHistoryState()

function disableClientRouting(err: unknown, log: boolean) {
  assert(isErrorFetchingStaticAssets(err))

  globalObject.clientRoutingIsDisabled = true

  if (log) {
    // We don't use console.error() to avoid flooding error trackers such as Sentry
    console.log(err)
  }
  assertInfo(
    false,
    [
      'Failed to fetch static asset.',
      import.meta.env.PROD ? 'This usually happens when a new frontend is deployed.' : null,
      'Falling back to Server Routing.',
      '(The next page navigation will use Server Routing instead of Client Routing.)'
    ]
      .filter(Boolean)
      .join(' '),
    { onlyOnce: true }
  )
}

function useClientRouter() {
  autoSaveScrollPosition()

  onLinkClick((url: string, { keepScrollPosition }) => {
    const scrollTarget = keepScrollPosition ? 'preserve-scroll' : 'scroll-to-top-or-hash'
    fetchAndRender({
      scrollTarget,
      urlOriginal: url,
      isBackwardNavigation: false,
      checkClientSideRenderable: true,
      pageContextsFromRewrite: []
    })
  })
  onBrowserHistoryNavigation((scrollTarget, isBackwardNavigation) => {
    fetchAndRender({ scrollTarget, isBackwardNavigation, pageContextsFromRewrite: [] })
  })
  defineNavigate(async (url: string, { keepScrollPosition = false, overwriteLastHistoryEntry = false } = {}) => {
    const scrollTarget = keepScrollPosition ? 'preserve-scroll' : 'scroll-to-top-or-hash'
    await fetchAndRender({
      scrollTarget,
      urlOriginal: url,
      overwriteLastHistoryEntry,
      isBackwardNavigation: false,
      checkClientSideRenderable: true,
      pageContextsFromRewrite: []
    })
  })

  let renderingCounter = 0
  let renderPromise: Promise<void> | undefined
  let isTransitioning: boolean = false
  fetchAndRender({ scrollTarget: 'preserve-scroll', isBackwardNavigation: null, pageContextsFromRewrite: [] })

  return

  async function fetchAndRender({
    scrollTarget,
    urlOriginal = getCurrentUrl(),
    overwriteLastHistoryEntry = false,
    isBackwardNavigation,
    checkClientSideRenderable,
    pageContextsFromRewrite
  }: {
    scrollTarget: ScrollTarget
    urlOriginal?: string
    overwriteLastHistoryEntry?: boolean
    isBackwardNavigation: boolean | null
    checkClientSideRenderable?: boolean
    pageContextsFromRewrite: PageContextFromRewrite[]
  }): Promise<void> {
    if (globalObject.clientRoutingIsDisabled) {
      serverSideRouteTo(urlOriginal)
      return
    }
    const pageContextFromAllRewrites = getPageContextFromRewrite(pageContextsFromRewrite)
    if (checkClientSideRenderable) {
      const urlLogical = pageContextFromAllRewrites.urlRewrite ?? urlOriginal
      let isClientRoutable: boolean
      try {
        isClientRoutable = await isClientSideRoutable(urlLogical)
      } catch (err) {
        if (!isAbortError(err)) {
          // If a route() hook has a bug
          throw err
        } else {
          // If the user's route() hook throw redirect() / throw renderErrorPage() / throw renderUrl()
          // We handle the abort error down below: the user's route() hook is called again in getPageContext()
          isClientRoutable = true
        }
      }
      if (!isClientRoutable) {
        serverSideRouteTo(urlOriginal)
        return
      }
    }

    const pageContextBase = {
      urlOriginal,
      isBackwardNavigation,
      ...pageContextFromAllRewrites
    }

    const renderingNumber = ++renderingCounter
    assert(renderingNumber >= 1)

    // Start transition before any await's
    if (renderingNumber > 1) {
      if (isTransitioning === false) {
        globalObject.onPageTransitionStart?.(pageContextBase)
        isTransitioning = true
      }
    }

    let hydrationCanBeAborted = false
    const shouldAbort = () => {
      {
        // We should never abort the hydration if `hydrationCanBeAborted` isn't `true`
        const isHydration = renderingNumber === 1
        if (isHydration && hydrationCanBeAborted === false) {
          return false
        }
      }
      // If there is a newer rendering, we should abort all previous renderings
      if (renderingNumber !== renderingCounter) {
        return true
      }
      return false
    }

    const pageContext = await createPageContext(pageContextBase)
    if (shouldAbort()) {
      return
    }
    const isFirstRenderAttempt = renderingNumber === 1
    objectAssign(pageContext, {
      _isFirstRenderAttempt: isFirstRenderAttempt
    })

    let pageContextAddendum: PromiseType<ReturnType<typeof getPageContext>>
    try {
      pageContextAddendum = await getPageContext(pageContext)
    } catch (err: unknown) {
      if (!isAbortError(err)) {
        // We don't swallow 404 errors:
        //  - On the server-side, VPS swallows / doesn't show any 404 error log because it's expected that a user may go to some random non-existent URL. (We don't want to flood the app's error tracking with 404 logs.)
        //  - On the client-side, if the user navigates to a 404 then it means that the UI has a broken link. (It isn't expected that users can go to some random URL using the client-side router, as it would require, for example, the user to manually change the URL of a link by manually manipulating the DOM which highly unlikely.)
        console.error(err)
      } else {
        // We swallow throw redirect()/renderErrorPage()/renderUrl() called by client-side hooks onBeforeRender() and guard()
        // We handle the abort error down below.
      }

      if (checkIfAbort(err, pageContext)) return

      if (isAbortError(err)) {
        const errAbort = err
        logAbortErrorHandled(err, pageContext._isProduction, pageContext)
        const pageContextAddition = errAbort._pageContextAddition
        if (pageContextAddition._abortCaller === 'renderUrl') {
          await fetchAndRender({
            scrollTarget,
            urlOriginal,
            overwriteLastHistoryEntry,
            isBackwardNavigation,
            pageContextsFromRewrite: [...pageContextsFromRewrite, pageContextAddition]
          })
          return;
        }
        if (pageContextAddition._abortCaller === 'redirect') {
          await fetchAndRender({
            scrollTarget: 'scroll-to-top-or-hash',
            urlOriginal: pageContextAddition.urlRedirect,
            overwriteLastHistoryEntry: false,
            isBackwardNavigation: false,
            checkClientSideRenderable: true,
            pageContextsFromRewrite: []
          })
          return;
        }
        assert(pageContextAddition._abortCaller === 'renderErrorPage')
        objectAssign(pageContext, pageContextAddition)
      } else {
        objectAssign(pageContext, { is404: checkIf404(err) })
      }

      try {
        pageContextAddendum = await getPageContextErrorPage(pageContext)
      } catch (err2: unknown) {
        // - When user hasn't defined a `_error.page.js` file
        // - Some unpexected vite-plugin-ssr internal error

        if (checkIfAbort(err2, pageContext)) return

        if (!isFirstRenderAttempt) {
          setTimeout(() => {
            // We let the server show the 404 page
            window.location.pathname = urlOriginal
          }, 0)
        }

        if (!isEquivalentError(err, err2)) {
          throw err2
        } else {
          // Abort
          return
        }
      }
    }
    objectAssign(pageContext, pageContextAddendum)
    assertHook(pageContext, 'onPageTransitionStart')
    globalObject.onPageTransitionStart = pageContext.exports.onPageTransitionStart
    if (pageContext.exports.hydrationCanBeAborted) {
      hydrationCanBeAborted = true
    } else {
      assertWarning(
        !isReact(),
        'You seem to be using React; we recommend setting `hydrationCanBeAborted` to `true`, see https://vite-plugin-ssr.com/clientRouting',
        { onlyOnce: true }
      )
    }

    if (shouldAbort()) {
      return
    }

    if (renderPromise) {
      // Always make sure that the previous render has finished,
      // otherwise that previous render may finish after this one.
      await renderPromise
    }
    if (shouldAbort()) {
      return
    }

    changeUrl(urlOriginal, overwriteLastHistoryEntry)
    navigationState.markNavigationChange()
    assert(renderPromise === undefined)
    renderPromise = (async () => {
      await executeOnRenderClientHook(pageContext, true)
      addLinkPrefetchHandlers(pageContext)
    })()
    await renderPromise
    renderPromise = undefined

    if (pageContext._isFirstRenderAttempt) {
      assertHook(pageContext, 'onHydrationEnd')
      const { onHydrationEnd } = pageContext.exports
      if (onHydrationEnd) {
        const hookFilePath = pageContext.exportsAll.onHydrationEnd![0]!.exportSource
        assert(hookFilePath)
        await executeHook(() => onHydrationEnd(pageContext), 'onHydrationEnd', hookFilePath)
      }
    } else if (renderingNumber === renderingCounter) {
      if (pageContext.exports.onPageTransitionEnd) {
        assertHook(pageContext, 'onPageTransitionEnd')
        pageContext.exports.onPageTransitionEnd(pageContext)
      }
      isTransitioning = false
    }

    setScrollPosition(scrollTarget)
    browserNativeScrollRestoration_disable()
    globalObject.initialRenderIsDone = true
  }
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
    assert(url)
    ev.preventDefault()

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

function onBrowserHistoryNavigation(
  callback: (scrollPosition: ScrollTarget, isBackwardNavigation: null | boolean) => void
) {
  // The `event` of `window.addEventListener('popstate', (event) => /*...*/)` is useless:
  //  - The History API doesn't provide the previous state (the popped state): https://stackoverflow.com/questions/48055323/is-history-state-always-the-same-as-popstate-event-state
  window.addEventListener('popstate', () => {
    const currentState = getState()

    const scrollTarget = currentState.historyState.scrollPosition || 'scroll-to-top-or-hash'

    const isHashNavigation = currentState.urlWithoutHash === globalObject.previousState.urlWithoutHash

    const isBackwardNavigation =
      !currentState.historyState.timestamp || !globalObject.previousState.historyState.timestamp
        ? null
        : currentState.historyState.timestamp < globalObject.previousState.historyState.timestamp

    globalObject.previousState = currentState

    if (isHashNavigation) {
      // - `history.state` is uninitialized (`null`) when:
      //   - The vite-plugin-ssr app runs `window.location.hash = '#section'`.
      //   - The user clicks on an anchor link `<a href="#section">Section</a>`. (Because vite-plugin-ssr's `onLinkClick()` handler skips hash links.)
      // - `history.state` is `null` when uninitialized: https://developer.mozilla.org/en-US/docs/Web/API/History/state
      // - Alternatively, we completely take over hash navigation and reproduce the browser's native behavior upon hash navigation.
      //   - Problem: we cannot intercept `window.location.hash = '#section'`. (Or maybe we can with the `hashchange` event?)
      //   - Other potential problem: would there be a conflict when the user wants to override the browser's default behavior? E.g. for smooth scrolling, or when using hashes for saving states of some fancy animations.
      // - Another alternative: we use the browser's scroll restoration mechanism (see `browserNativeScrollRestoration_enable()` below).
      //   - Problem: not clear when to call `browserNativeScrollRestoration_disable()`/`browserNativeScrollRestoration_enable()`
      //   - Other potential problem are inconsistencies between browsers: specification says that setting `window.history.scrollRestoration` only affects the current entry in the session history. But this seems to contradict what folks saying.
      //     - Specification: https://html.spec.whatwg.org/multipage/history.html#the-history-interface
      //     - https://stackoverflow.com/questions/70188241/history-scrollrestoration-manual-doesnt-prevent-safari-from-restoring-scrol
      if (window.history.state === null) {
        // The browser already scrolled to `#${hash}` => the current scroll position is the right one => we save it with `initHistoryState()`.
        initHistoryState()
        globalObject.previousState = getState()
      } else {
        // If `history.state !== null` then it means that `popstate` was triggered by the user clicking on his browser's forward/backward history button.
        setScrollPosition(scrollTarget)
      }
    } else {
      // Fetch & render new page
      callback(scrollTarget, isBackwardNavigation)
    }
  })
}

function changeUrl(url: string, overwriteLastHistoryEntry: boolean) {
  if (getCurrentUrl() === url) return
  browserNativeScrollRestoration_disable()
  pushHistory(url, overwriteLastHistoryEntry)
  globalObject.previousState = getState()
}

function getState() {
  return {
    urlWithoutHash: getCurrentUrl({ withoutHash: true }),
    historyState: getHistoryState()
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
    // We replicate the browser's native behavior
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
  setScroll(scrollPosition)
}

/** Change the browser's scoll position, in a way that works during a repaint. */
function setScroll(scrollPosition: ScrollPosition) {
  const scroll = () => window.scrollTo(scrollPosition.x, scrollPosition.y)
  const done = () => window.scrollX === scrollPosition.x && window.scrollY === scrollPosition.y

  // In principle, this `done()` call should force the repaint to be finished. But that doesn't seem to be the case with `Firefox 97.0.1`.
  if (done()) return

  scroll()

  // Because `done()` doesn't seem to always force the repaint to be finished, we potentially need to retry again.
  if (done()) return
  requestAnimationFrame(() => {
    scroll()
    if (done()) return

    setTimeout(async () => {
      scroll()
      if (done()) return

      // In principle, `requestAnimationFrame() -> setTimeout(, 0)` should be enough.
      //  - https://stackoverflow.com/questions/61281139/waiting-for-repaint-in-javascript
      //  - But it's not enough for `Firefox 97.0.1`.
      //  - The following strategy is very agressive. It doesn't need to be that aggressive for Firefox. But we do it to be safe.
      const start = new Date().getTime()
      while (true) {
        await sleep(10)
        scroll()
        if (done()) return
        const millisecondsElapsed = new Date().getTime() - start
        if (millisecondsElapsed > 100) return
      }
    }, 0)
  })
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

// We use the browser's native scroll restoration mechanism only for the first render
function setupNativeScrollRestoration() {
  browserNativeScrollRestoration_enable()
  onPageHide(browserNativeScrollRestoration_enable)
  onPageShow(() => globalObject.initialRenderIsDone && browserNativeScrollRestoration_disable())
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

function checkIfAbort(err: unknown, pageContext: { urlOriginal: string; _isFirstRenderAttempt: boolean }): boolean {
  if (isObject(err) && err._abortRendering) return true

  if (handleErrorFetchingStaticAssets(err, pageContext)) {
    return true
  }

  return false
}

function handleErrorFetchingStaticAssets(
  err: unknown,
  pageContext: { urlOriginal: string; _isFirstRenderAttempt: boolean }
): boolean {
  if (!isErrorFetchingStaticAssets(err)) {
    return false
  }

  if (pageContext._isFirstRenderAttempt) {
    disableClientRouting(err, false)
    // This may happen if the frontend was newly deployed during hydration.
    // Ideally: re-try a couple of times by reloading the page (not entirely trivial to implement since `localStorage` is needed.)
    throw err
  } else {
    disableClientRouting(err, true)
  }

  serverSideRouteTo(pageContext.urlOriginal)

  return true
}

function isDisableAutomaticLinkInterception(): boolean {
  // @ts-ignore
  return !!window._disableAutomaticLinkInterception
  /* globalObject should be used if we want to make disableAutomaticLinkInterception a page-by-page setting
  return globalObject.disableAutomaticLinkInterception ?? false
  */
}
