export { renderPageClientSide }
export { getRenderCount }
export { disableClientRouting }

import {
  assert,
  getCurrentUrl,
  isSameErrorMessage,
  objectAssign,
  serverSideRouteTo,
  getGlobalObject,
  executeHook,
  hasProp
} from './utils.js'
import {
  getPageContextFromHooks_errorPage,
  getPageContextFromHooks_hydration,
  getPageContextFromHooks_uponNavigation,
  isServerSideRouted,
  getPageContextFromHooks_serialized
} from './getPageContextFromHooks.js'
import { createPageContext } from './createPageContext.js'
import { addLinkPrefetchHandlers } from './prefetch.js'
import { assertInfo, assertWarning, isReact } from './utils.js'
import { type PageContextBeforeRenderClient, executeOnRenderClientHook } from '../shared/executeOnRenderClientHook.js'
import { type Hook, assertHook, getHook } from '../../shared/hooks/getHook.js'
import { isErrorFetchingStaticAssets, loadPageFilesClientSide } from '../shared/loadPageFilesClientSide.js'
import { pushHistory } from './history.js'
import {
  assertNoInfiniteAbortLoop,
  getPageContextFromAllRewrites,
  isAbortError,
  logAbortErrorHandled,
  type PageContextFromRewrite
} from '../../shared/route/abort.js'
import { route, type PageContextFromRoute } from '../../shared/route/index.js'
import { isClientSideRoutable } from './isClientSideRoutable.js'
import { setScrollPosition, type ScrollTarget } from './setScrollPosition.js'
import { updateState } from './onBrowserHistoryNavigation.js'
import { browserNativeScrollRestoration_disable, setInitialRenderIsDone } from './scrollRestoration.js'

const globalObject = getGlobalObject<{
  onPageTransitionStart?: Hook | null
  clientRoutingIsDisabled?: true
  renderCounter: number
  renderPromise?: Promise<void>
  isTransitioning?: true
  previousPageContext?: { _pageId: string }
}>('renderPageClientSide.ts', { renderCounter: 0 })

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

  // isHydrationRender <=> the first render attempt
  const { isRenderOutdated, setHydrationCanBeAborted, isHydrationRender } = getIsRenderOutdated()
  const callTransitionHooks = !isHydrationRender
  assert(isClientSideNavigation === !isHydrationRender)
  assertNoInfiniteAbortLoop(pageContextsFromRewrite.length, redirectCount)

  if (globalObject.clientRoutingIsDisabled) {
    serverSideRouteTo(urlOriginal)
    return
  }

  await renderPageNominal()

  return

  async function renderPageNominal() {
    const pageContext = await getPageContextBegin()
    if (isRenderOutdated()) return

    // Route
    let pageContextFromRoute: PageContextFromRoute | null = null
    if (!isHydrationRender) {
      try {
        pageContextFromRoute = await route(pageContext)
      } catch (err) {
        await renderErrorPage(err)
        return
      }
      if (isRenderOutdated()) return
      assert(!('urlOriginal' in pageContextFromRoute))
      objectAssign(pageContext, pageContextFromRoute)
      let isClientRoutable: boolean
      if (!pageContextFromRoute._pageId) {
        isClientRoutable = false
      } else {
        isClientRoutable = await isClientSideRoutable(pageContextFromRoute._pageId, pageContext)
        if (isRenderOutdated()) return
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

    // onPageTransitionStart()
    if (callTransitionHooks) {
      if (!globalObject.isTransitioning) {
        if (globalObject.onPageTransitionStart) {
          const hook = globalObject.onPageTransitionStart
          const { hookFn } = hook
          await executeHook(() => hookFn(pageContext), hook)
        }
        globalObject.isTransitioning = true
        if (isRenderOutdated()) return
      }
    }

    // Get and/or fetch pageContext
    if (isHydrationRender) {
      assert(!pageContextFromRoute)

      const pageContextSerialized = getPageContextFromHooks_serialized()
      objectAssign(pageContext, pageContextSerialized)

      try {
        objectAssign(pageContext, await loadPageFilesClientSide(pageContext._pageId, pageContext))
      } catch (err) {
        // TODO? Can't we be more precise here?
        await renderErrorPage(err)
        return
      }
      if (isRenderOutdated()) return

      let pageContextFromHooks: Awaited<ReturnType<typeof getPageContextFromHooks_hydration>>
      try {
        pageContextFromHooks = await getPageContextFromHooks_hydration(pageContext)
      } catch (err) {
        await renderErrorPage(err)
        return
      }
      if (isRenderOutdated()) return

      assert(!('urlOriginal' in pageContextFromHooks))
      objectAssign(pageContext, pageContextFromHooks)

      // Render page view
      await renderPageView(pageContext)
    } else {
      assert(pageContextFromRoute)
      assert(pageContextFromRoute._pageId)
      assert(hasProp(pageContextFromRoute, '_pageId', 'string')) // Help TS
      assert(!('urlOriginal' in pageContextFromRoute))
      objectAssign(pageContext, pageContextFromRoute)
      let pageContextFromHooks: Awaited<ReturnType<typeof getPageContextFromHooks_uponNavigation>>
      try {
        pageContextFromHooks = await getPageContextFromHooks_uponNavigation(pageContext)
      } catch (err) {
        await renderErrorPage(err)
        return
      }
      if (isRenderOutdated()) return

      assert(!('urlOriginal' in pageContextFromHooks))
      objectAssign(pageContext, pageContextFromHooks)

      // Render page view
      await renderPageView(pageContext)
    }
  }

  async function getPageContextBegin() {
    const pageContext = await createPageContext(urlOriginal)
    objectAssign(pageContext, {
      isBackwardNavigation,
      isClientSideNavigation
    })
    {
      const pageContextFromAllRewrites = getPageContextFromAllRewrites(pageContextsFromRewrite)
      assert(!('urlOriginal' in pageContextFromAllRewrites))
      objectAssign(pageContext, pageContextFromAllRewrites)
    }
    return pageContext
  }

  async function renderErrorPage(err: unknown) {
    const pageContext = await getPageContextBegin()
    if (isRenderOutdated()) return

    assert(err)
    assert(!('errorWhileRendering' in pageContext))
    pageContext.errorWhileRendering = err

    if (!isAbortError(err)) {
      // We don't swallow 404 errors:
      //  - On the server-side, Vike swallows / doesn't show any 404 error log because it's expected that a user may go to some random non-existent URL. (We don't want to flood the app's error tracking with 404 logs.)
      //  - On the client-side, if the user navigates to a 404 then it means that the UI has a broken link. (It isn't expected that users can go to some random URL using the client-side router, as it would require, for example, the user to manually change the URL of a link by manually manipulating the DOM which highly unlikely.)
      console.error(err)
    } else {
      // We swallow throw redirect()/render() called by client-side hooks onBeforeRender()/data()/guard()
      // We handle the abort error down below.
    }

    if (shouldSwallowAndInterrupt(err, pageContext, isHydrationRender)) return

    if (isAbortError(err)) {
      const errAbort = err
      logAbortErrorHandled(err, !import.meta.env.DEV, pageContext)
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
      assert(!('urlOriginal' in pageContextAbort))
      objectAssign(pageContext, pageContextAbort)
      if (pageContextAbort.abortStatusCode === 404) {
        objectAssign(pageContext, { is404: true })
      }
    } else {
      objectAssign(pageContext, { is404: false })
    }

    let pageContextFromHooks: Awaited<ReturnType<typeof getPageContextFromHooks_errorPage>>
    try {
      pageContextFromHooks = await getPageContextFromHooks_errorPage(pageContext)
    } catch (errErrorPage: unknown) {
      // - When user hasn't defined a `_error.page.js` file
      // - Some Vike unpexected internal error

      if (shouldSwallowAndInterrupt(errErrorPage, pageContext, isHydrationRender)) return
      if (isSameErrorMessage(err, errErrorPage)) {
        /* When we can't render the error page, we prefer showing a blank page over letting the server-side try because otherwise:
           - We risk running into an infinite loop of reloads which would overload the server.
           - An infinite reloading page is a even worse UX than a blank page.
        serverSideRouteTo(urlOriginal)
        */
        return
      }

      // We `throw err2` instead of `console.error(err2)` so that, when using `navigate()`, the error propagates to the user `navigate()` call
      throw errErrorPage
    }
    if (isRenderOutdated()) return

    assert(pageContextFromHooks)
    assert(!('urlOriginal' in pageContextFromHooks))
    objectAssign(pageContext, pageContextFromHooks)
    await renderPageView(pageContext, true)
  }

  async function renderPageView(
    pageContext: PageContextBeforeRenderClient & { urlPathname: string },
    isErrorPage?: true
  ) {
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
        'You seem to be using React; we recommend setting hydrationCanBeAborted to true, see https://vike.dev/hydrationCanBeAborted',
        { onlyOnce: true }
      )
    }
    // There wasn't any `await` but result may change because we just called setHydrationCanBeAborted()
    if (isRenderOutdated()) return

    // We use globalObject.renderPromise in order to ensure that there is never two concurrent onRenderClient() calls
    if (globalObject.renderPromise) {
      // Make sure that the previous render has finished
      await globalObject.renderPromise
      assert(globalObject.renderPromise === undefined)
      if (isRenderOutdated()) return
    }
    changeUrl(urlOriginal, overwriteLastHistoryEntry)
    globalObject.previousPageContext = pageContext
    assert(globalObject.renderPromise === undefined)
    globalObject.renderPromise = (async () => {
      try {
        await executeOnRenderClientHook(pageContext, true)
      } catch (err) {
        if (!isErrorPage) {
          renderErrorPage(err)
        } else {
          throw err
        }
      }
      addLinkPrefetchHandlers(pageContext)
      globalObject.renderPromise = undefined
    })()
    await globalObject.renderPromise
    assert(globalObject.renderPromise === undefined)
    /* We don't abort in order to ensure that onHydrationEnd() is called: we abort only after onHydrationEnd() is called.
  if (isRenderOutdated(true)) return
  */

    // onHydrationEnd()
    if (isHydrationRender) {
      assertHook(pageContext, 'onHydrationEnd')
      const hook = getHook(pageContext, 'onHydrationEnd')
      if (hook) {
        const { hookFn } = hook
        await executeHook(() => hookFn(pageContext), hook)
        if (isRenderOutdated(true)) return
      }
    }

    // We abort only after onHydrationEnd() is called
    if (isRenderOutdated(true)) return

    // onPageTransitionEnd()
    if (callTransitionHooks) {
      assertHook(pageContext, 'onPageTransitionEnd')
      const hook = getHook(pageContext, 'onPageTransitionEnd')
      if (hook) {
        const { hookFn } = hook
        await executeHook(() => hookFn(pageContext), hook)
        if (isRenderOutdated(true)) return
      }
      globalObject.isTransitioning = undefined
    }

    // Page scrolling
    setScrollPosition(scrollTarget)
    browserNativeScrollRestoration_disable()
    setInitialRenderIsDone()
  }
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
  isHydrationRender: boolean
): boolean {
  if (isServerSideRouted(err)) return true
  if (handleErrorFetchingStaticAssets(err, pageContext, isHydrationRender)) return true
  return false
}

function handleErrorFetchingStaticAssets(
  err: unknown,
  pageContext: { urlOriginal: string },
  isHydrationRender: boolean
): boolean {
  if (!isErrorFetchingStaticAssets(err)) {
    return false
  }

  if (isHydrationRender) {
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

function getIsRenderOutdated() {
  const renderNumber = ++globalObject.renderCounter
  assert(renderNumber >= 1)

  let hydrationCanBeAborted = false
  const setHydrationCanBeAborted = () => {
    hydrationCanBeAborted = true
  }

  /** Whether the rendering should be aborted because a new rendering has started. We should call this after each `await`. */
  const isRenderOutdated = (isRenderCleanup?: true) => {
    // Never abort hydration if `hydrationCanBeAborted` isn't `true`
    {
      const isHydration = renderNumber === 1
      if (isHydration && !hydrationCanBeAborted && !isRenderCleanup) {
        return false
      }
    }

    // If there is a newer rendering, we should abort all previous renderings
    return renderNumber !== globalObject.renderCounter
  }

  return {
    isRenderOutdated,
    setHydrationCanBeAborted,
    isHydrationRender: renderNumber === 1
  }
}

function getRenderCount(): number {
  return globalObject.renderCounter
}
