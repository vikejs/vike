export { renderPageClientSide }
export { getRenderCount }
export { disableClientRouting }

import {
  assert,
  getCurrentUrl,
  isEquivalentError,
  objectAssign,
  serverSideRouteTo,
  getGlobalObject,
  executeHook,
  hasProp
} from './utils.js'
import {
  PageContextFromHooks,
  getPageContextFromHooks_errorPage,
  getPageContextFromHooks_firstRender,
  getPageContextFromHooks_uponNavigation,
  isAlreadyServerSideRouted
} from './getPageContextFromHooks.js'
import { createPageContext } from './createPageContext.js'
import { addLinkPrefetchHandlers } from './prefetch.js'
import { assertInfo, assertWarning, isReact } from './utils.js'
import { executeOnRenderClientHook } from '../shared/executeOnRenderClientHook.js'
import { type Hook, assertHook, getHook } from '../../shared/hooks/getHook.js'
import { isErrorFetchingStaticAssets } from '../shared/loadPageFilesClientSide.js'
import { pushHistory } from './history.js'
import {
  assertNoInfiniteAbortLoop,
  getPageContextFromAllRewrites,
  isAbortError,
  logAbortErrorHandled,
  PageContextFromRewrite
} from '../../shared/route/abort.js'
import { route, type PageContextFromRoute } from '../../shared/route/index.js'
import { isClientSideRoutable } from './isClientSideRoutable.js'
import { setScrollPosition, type ScrollTarget } from './setScrollPosition.js'
import { updateState } from './onBrowserHistoryNavigation.js'
import { browserNativeScrollRestoration_disable, setInitialRenderIsDone } from './scrollRestoration.js'

const globalObject = getGlobalObject<{
  onPageTransitionStart: null | Hook
  clientRoutingIsDisabled?: true
  renderCounter: number
  renderPromise?: Promise<void>
  isTransitioning?: true
  previousPageContext?: { _pageId: string }
}>('renderPageClientSide.ts', { renderCounter: 0, onPageTransitionStart: null })

type RenderArgs = {
  scrollTarget: ScrollTarget
  isBackwardNavigation: boolean | null
  urlOriginal?: string
  overwriteLastHistoryEntry?: boolean
  pageContextsFromRewrite?: PageContextFromRewrite[]
  redirectCount?: number
  /** Whether the navigation was triggered by the user land calling `history.pushState()` */
  isUserLandPushStateNavigation?: boolean
  isClientSideNavigation?: boolean
}
async function renderPageClientSide(renderArgs: RenderArgs): Promise<void> {
  const {
    scrollTarget,
    urlOriginal = getCurrentUrl(),
    overwriteLastHistoryEntry = false,
    isBackwardNavigation,
    pageContextsFromRewrite = [],
    redirectCount = 0,
    isUserLandPushStateNavigation,
    isClientSideNavigation = true
  } = renderArgs
  const { abortRender, setHydrationCanBeAborted, isFirstRender } = getAbortRender()

  assert(isClientSideNavigation === !isFirstRender)
  assertNoInfiniteAbortLoop(pageContextsFromRewrite.length, redirectCount)

  if (globalObject.clientRoutingIsDisabled) {
    serverSideRouteTo(urlOriginal)
    return
  }

  const pageContext = await createPageContext(urlOriginal)
  if (abortRender()) return
  objectAssign(pageContext, {
    isBackwardNavigation,
    isClientSideNavigation
  })

  {
    const pageContextFromAllRewrites = getPageContextFromAllRewrites(pageContextsFromRewrite)
    objectAssign(pageContext, pageContextFromAllRewrites)
  }

  let renderState: {
    err?: unknown
    pageContextFromRoute?: PageContextFromRoute
    pageContextFromHooks?: PageContextFromHooks
  } = {}
  const onError = (err: unknown) => {
    assert(err)
    assert(!('err' in renderState))
    assert(!('errorWhileRendering' in pageContext))
    renderState.err = err
    pageContext.errorWhileRendering = err
  }

  if (!isFirstRender) {
    // Route
    try {
      renderState = { pageContextFromRoute: await route(pageContext) }
    } catch (err) {
      onError(err)
    }
    if (abortRender()) return

    // Check whether rendering should be skipped
    if (renderState.pageContextFromRoute) {
      const { pageContextFromRoute } = renderState
      objectAssign(pageContext, pageContextFromRoute)
      let isClientRoutable: boolean
      if (!pageContextFromRoute._pageId) {
        isClientRoutable = false
      } else {
        isClientRoutable = await isClientSideRoutable(pageContextFromRoute._pageId, pageContext)
        if (abortRender()) return
      }
      if (!isClientRoutable) {
        serverSideRouteTo(urlOriginal)
        return
      }
      const isSamePage =
        pageContextFromRoute._pageId &&
        globalObject.previousPageContext?._pageId &&
        pageContextFromRoute._pageId === globalObject.previousPageContext._pageId
      if (isUserLandPushStateNavigation && isSamePage) {
        // Skip's Vike's rendering; let the user handle the navigation
        return
      }
    }
  }

  // onPageTransitionStart()
  const callTransitionHooks = !isFirstRender
  if (callTransitionHooks) {
    if (!globalObject.isTransitioning) {
      if (globalObject.onPageTransitionStart) {
        const hook = globalObject.onPageTransitionStart
        const onPageTransitionStart = hook.hookFn
        await executeHook(
          () => onPageTransitionStart(pageContext),
          'onPageTransitionStart',
          hook.hookFilePath,
          hook.configTimeouts
        )
      }
      globalObject.isTransitioning = true
      if (abortRender()) return
    }
  }

  if (isFirstRender) {
    assert(!renderState.pageContextFromRoute)
    assert(!renderState.err)
    try {
      renderState.pageContextFromHooks = await getPageContextFromHooks_firstRender(pageContext)
    } catch (err) {
      onError(err)
    }
    if (abortRender()) return
  } else {
    if (!renderState.err) {
      const { pageContextFromRoute } = renderState
      assert(pageContextFromRoute)
      assert(pageContextFromRoute._pageId)
      assert(hasProp(pageContextFromRoute, '_pageId', 'string')) // Help TS
      objectAssign(pageContext, pageContextFromRoute)
      try {
        renderState.pageContextFromHooks = await getPageContextFromHooks_uponNavigation(pageContext)
      } catch (err) {
        onError(err)
      }
      if (abortRender()) return
    }
  }

  if ('err' in renderState) {
    const { err } = renderState
    if (!isAbortError(err)) {
      // We don't swallow 404 errors:
      //  - On the server-side, Vike swallows / doesn't show any 404 error log because it's expected that a user may go to some random non-existent URL. (We don't want to flood the app's error tracking with 404 logs.)
      //  - On the client-side, if the user navigates to a 404 then it means that the UI has a broken link. (It isn't expected that users can go to some random URL using the client-side router, as it would require, for example, the user to manually change the URL of a link by manually manipulating the DOM which highly unlikely.)
      console.error(err)
    } else {
      // We swallow throw redirect()/render() called by client-side hooks onBeforeRender() and guard()
      // We handle the abort error down below.
    }

    if (shouldSwallowAndInterrupt(err, pageContext, isFirstRender)) return

    if (isAbortError(err)) {
      const errAbort = err
      logAbortErrorHandled(err, pageContext._isProduction, pageContext)
      const pageContextAbort = errAbort._pageContextAbort

      // throw render('/some-url')
      if (pageContextAbort._urlRewrite) {
        await renderPageClientSide({
          ...renderArgs,
          scrollTarget: 'scroll-to-top-or-hash',
          pageContextsFromRewrite: [...pageContextsFromRewrite, pageContextAbort]
        })
        return
      }

      // throw redirect('/some-url')
      if (pageContextAbort._urlRedirect) {
        const urlRedirect = pageContextAbort._urlRedirect.url
        if (urlRedirect.startsWith('http')) {
          // External redirection
          window.location.href = urlRedirect
          return
        } else {
          await renderPageClientSide({
            ...renderArgs,
            scrollTarget: 'scroll-to-top-or-hash',
            urlOriginal: urlRedirect,
            overwriteLastHistoryEntry: false,
            isBackwardNavigation: false,
            redirectCount: redirectCount + 1
          })
        }
        return
      }

      // throw render(statusCode)
      assert(pageContextAbort.abortStatusCode)
      objectAssign(pageContext, pageContextAbort)
      if (pageContextAbort.abortStatusCode === 404) {
        objectAssign(pageContext, { is404: true })
      }
    } else {
      objectAssign(pageContext, { is404: false })
    }

    try {
      renderState.pageContextFromHooks = await getPageContextFromHooks_errorPage(pageContext)
    } catch (err2: unknown) {
      // - When user hasn't defined a `_error.page.js` file
      // - Some unpexected vike internal error

      if (shouldSwallowAndInterrupt(err2, pageContext, isFirstRender)) return

      if (!isFirstRender) {
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
    if (abortRender()) return
  }
  const { pageContextFromHooks } = renderState
  assert(pageContextFromHooks)
  objectAssign(pageContext, pageContextFromHooks)

  // Set global onPageTransitionStart()
  assertHook(pageContext, 'onPageTransitionStart')
  const onPageTransitionStartHook = getHook(pageContext, 'onPageTransitionStart')
  globalObject.onPageTransitionStart = onPageTransitionStartHook

  // Set global hydrationCanBeAborted
  if (pageContext.exports.hydrationCanBeAborted) {
    setHydrationCanBeAborted()
  } else {
    assertWarning(
      !isReact(),
      'You seem to be using React; we recommend setting hydrationCanBeAborted to true, see https://vike.dev/clientRouting',
      { onlyOnce: true }
    )
  }
  // There wasn't any `await` but result may change because we just called setHydrationCanBeAborted()
  if (abortRender()) return

  // We use globalObject.renderPromise in order to ensure that there is never two concurrent onRenderClient() calls
  if (globalObject.renderPromise) {
    // Make sure that the previous render has finished
    await globalObject.renderPromise
    assert(globalObject.renderPromise === undefined)
    if (abortRender()) return
  }
  changeUrl(urlOriginal, overwriteLastHistoryEntry)
  globalObject.previousPageContext = pageContext
  assert(globalObject.renderPromise === undefined)
  globalObject.renderPromise = (async () => {
    await executeOnRenderClientHook(pageContext, true)
    addLinkPrefetchHandlers(pageContext)
    globalObject.renderPromise = undefined
  })()
  await globalObject.renderPromise
  assert(globalObject.renderPromise === undefined)
  /* We don't abort in order to ensure that onHydrationEnd() is called: we abort only after onHydrationEnd() is called.
  if (abortRender(true)) return
  */

  // onHydrationEnd()
  if (isFirstRender) {
    assertHook(pageContext, 'onHydrationEnd')
    const onHydrationEnd = getHook(pageContext, 'onHydrationEnd')
    if (onHydrationEnd) {
      const { hookFn, hookFilePath, hookName, configTimeouts } = onHydrationEnd
      await executeHook(() => hookFn(pageContext), hookName, hookFilePath, configTimeouts)
      if (abortRender(true)) return
    }
  }

  // We abort only after onHydrationEnd() is called
  if (abortRender(true)) return

  // onPageTransitionEnd()
  if (callTransitionHooks) {
    assertHook(pageContext, 'onPageTransitionEnd')
    const onPageTransitionEnd = getHook(pageContext, 'onPageTransitionEnd')
    if (onPageTransitionEnd) {
      const { hookFn, hookFilePath, hookName, configTimeouts } = onPageTransitionEnd
      await executeHook(() => hookFn(pageContext), hookName, hookFilePath, configTimeouts)
      if (abortRender(true)) return
    }
    globalObject.isTransitioning = undefined
  }

  // Page scrolling
  setScrollPosition(scrollTarget)
  browserNativeScrollRestoration_disable()
  setInitialRenderIsDone()
}

function changeUrl(url: string, overwriteLastHistoryEntry: boolean) {
  if (getCurrentUrl() === url) return
  browserNativeScrollRestoration_disable()
  pushHistory(url, overwriteLastHistoryEntry)
  updateState()
}

function shouldSwallowAndInterrupt(
  err: unknown,
  pageContext: { urlOriginal: string },
  isFirstRender: boolean
): boolean {
  if (isAlreadyServerSideRouted(err)) return true
  if (handleErrorFetchingStaticAssets(err, pageContext, isFirstRender)) return true
  return false
}

function handleErrorFetchingStaticAssets(
  err: unknown,
  pageContext: { urlOriginal: string },
  isFirstRender: boolean
): boolean {
  if (!isErrorFetchingStaticAssets(err)) {
    return false
  }

  if (isFirstRender) {
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

function disableClientRouting(err: unknown, log: boolean) {
  assert(isErrorFetchingStaticAssets(err))

  globalObject.clientRoutingIsDisabled = true

  if (log) {
    // We don't use console.error() to avoid flooding error trackers such as Sentry
    console.log(err)
  }
  // @ts-ignore Since dist/cjs/client/ is never used, we can ignore this error.
  const isProd: boolean = import.meta.env.PROD
  assertInfo(
    false,
    [
      'Failed to fetch static asset.',
      isProd ? 'This usually happens when a new frontend is deployed.' : null,
      'Falling back to Server Routing.',
      '(The next page navigation will use Server Routing instead of Client Routing.)'
    ]
      .filter(Boolean)
      .join(' '),
    { onlyOnce: true }
  )
}

function getAbortRender() {
  const renderNumber = ++globalObject.renderCounter
  assert(renderNumber >= 1)

  let hydrationCanBeAborted = false
  const setHydrationCanBeAborted = () => {
    hydrationCanBeAborted = true
  }

  /** Whether the rendering should be aborted because a new rendering has started. We should call this after each `await`. */
  const abortRender = (isRenderCleanup?: true) => {
    // Never abort hydration if `hydrationCanBeAborted` isn't `true`
    if (!isRenderCleanup) {
      const isHydration = renderNumber === 1
      if (isHydration && !hydrationCanBeAborted) {
        return false
      }
    }

    // If there is a newer rendering, we should abort all previous renderings
    return renderNumber !== globalObject.renderCounter
  }

  return {
    abortRender,
    setHydrationCanBeAborted,
    isFirstRender: renderNumber === 1
  }
}

function getRenderCount(): number {
  return globalObject.renderCounter
}
