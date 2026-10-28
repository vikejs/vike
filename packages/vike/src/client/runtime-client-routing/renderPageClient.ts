export { renderPageClient }
export { getRenderCount }
export { disableClientRouting }
export { getPageContextClient }
export { createPageContextFromServer_experimentalRSC }
export type { PageContextBegin }
export type { PageContextInternalClientAfterRender }

import { assert, assertInfo, assertUsage, assertWarning } from '../../utils/assert.js'
import { catchInfiniteLoop } from '../../utils/catchInfiniteLoop.js'
import { genPromise } from '../../utils/genPromise.js'
import { getGlobalObject } from '../../utils/getGlobalObject.js'
import { hasProp } from '../../utils/hasProp.js'
import { isCallable } from '../../utils/isCallable.js'
import { isReact } from '../../utils/isReact.js'
import { objectAssign } from '../../utils/objectAssign.js'
import { redirectHard } from '../../utils/redirectHard.js'
import { updateType } from '../../utils/updateType.js'
import {
  getPageContextFromHooksClient,
  getPageContextFromHooksServer,
  getPageContextFromHooksClient_firstRender,
  getPageContextFromHooksServer_firstRender,
  type PageContextFromHooksServer,
  setPageContextInitIsPassedToClient,
  processPageContextFromServer,
} from './getPageContextFromHooks.js'
import { createPageContextClient, type PageContextCreatedClient } from './createPageContextClient.js'
import {
  addLinkPrefetchHandlers,
  addLinkPrefetchHandlers_unwatch,
  addLinkPrefetchHandlers_watch,
  getPageContextPrefetched,
  populatePageContextPrefetchCache,
} from './prefetch.js'
import { type PageContextBeforeRenderClient, execHookOnRenderClient } from '../shared/execHookOnRenderClient.js'
import {
  isErrorFetchingStaticAssets,
  loadPageConfigsLazyClientSide,
  PageContext_loadPageConfigsLazyClientSide,
} from '../shared/loadPageConfigsLazyClientSide.js'
import { changeUrl, saveScrollPosition, undoHistoryNavigation } from './history.js'
import {
  addNewPageContextAborted,
  type ErrorAbort,
  getPageContextAddendumAbort,
  isAbortError,
  logAbort,
  type PageContextAbort,
  type PageContextAborted,
} from '../../shared-server-client/route/abort.js'
import { route } from '../../shared-server-client/route/index.js'
import { forkPageContext } from '../../shared-server-client/forkPageContext.js'
import { isClientSideRoutable } from './isClientSideRoutable.js'
import { isScrollPosition, setScrollPosition, type ScrollTarget } from './setScrollPosition.js'
import { scrollRestoration_initialRenderIsDone } from './scrollRestoration.js'
import { getErrorPageId, isErrorPage } from '../../shared-server-client/error-page.js'
import type { PageContextConfig } from '../../shared-server-client/getPageFiles.js'
import { setPageContextCurrent } from './getPageContextCurrent.js'
import { getRouteStringParameterList } from '../../shared-server-client/route/resolveRouteString.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'
import type { PageContextClient, PageContextInternalClient } from '../../types/PageContext.js'
import { execHookList, execHook } from '../../shared-server-client/hooks/execHook.js'
import { type PageContextPublicClient, getPageContextPublicClient } from './getPageContextPublicClient.js'
import { getHooksFromPageContextNew } from '../../shared-server-client/hooks/getHook.js'
import { getPageContextPublicClientMinimal } from '../shared/getPageContextPublicClientShared.js'
import type { VikeGlobalInternal } from '../../types/VikeGlobalInternal.js'
import { logErrorClient } from './logErrorClient.js'
import '../assertEnvClient.js'

type PageContextInternalClientAfterRender = NonNullable<Awaited<ReturnType<typeof renderPageClient>>>

const globalObject = getGlobalObject<{
  clientRoutingIsDisabled?: true
  renderCounter: number
  onRenderClientPreviousPromise?: Promise<unknown>
  abortController?: AbortController
  isFirstRenderDone?: true
  isTransitioning?: true
  //https://vike.dev/pageContext#previousPageContext
  previousPageContext?: PreviousPageContext
  renderedPageContext?: PageContextInternalClient &
    PageContext_loadPageConfigsLazyClientSide & { previousPageContext: PreviousPageContext | null }
  currentPageContext?: Record<string, unknown>
  hydrationAwaitPromise: Promise<void>
  hydrationAwaitPromiseResolve: () => void
}>(
  'renderPageClient.ts',
  (() => {
    const { promise: hydrationAwaitPromise, resolve: hydrationAwaitPromiseResolve } = genPromise()
    return {
      renderCounter: 0,
      hydrationAwaitPromise,
      hydrationAwaitPromiseResolve,
    }
  })(),
)
type PreviousPageContext = { pageId: string } & PageContextConfig &
  PageContextRouted &
  PageContextCreatedClient &
  PageContextPublicClient
type PageContextRouted = { pageId: string; routeParams: Record<string, string> }

type PageContextBegin = Awaited<ReturnType<typeof getPageContextBegin>>

type RenderArgs = {
  scrollTarget: ScrollTarget
  isBackwardNavigation?: boolean | null // `null` when window.history.state.timestamp is missing
  isHistoryNavigation?: true
  urlOriginal?: string
  overwriteLastHistoryEntry?: boolean
  pageContextsAborted?: PageContextAborted[]
  // TODO/after-merge: rename to `doNotRerenderSamePage` ?
  doNotRenderIfSamePage?: boolean
  isClientSideNavigation?: boolean
  pageContextInitClient?: Record<string, unknown>
}
async function renderPageClient(renderArgs: RenderArgs) {
  catchInfiniteLoop('renderPageClient()')

  const {
    urlOriginal = getCurrentUrl(),
    overwriteLastHistoryEntry = false,
    isBackwardNavigation = false,
    isHistoryNavigation = false,
    doNotRenderIfSamePage,
    isClientSideNavigation = true,
    pageContextInitClient,
    pageContextsAborted = [],
  } = renderArgs
  let { scrollTarget } = renderArgs
  const { previousPageContext } = globalObject

  const abortController = new AbortController()
  const { isRenderOutdated, setHydrationCanBeAborted, setOnRenderClientCalled, isFirstRender } =
    getIsRenderOutdated(abortController)

  const pageContextBeginArgs = {
    urlOriginal,
    isBackwardNavigation,
    isHistoryNavigation,
    pageContextsAborted,
    isClientSideNavigation,
    pageContextInitClient,
    isFirstRender,
    // https://vike.dev/pageContext#abortSignal
    abortSignal: abortController.signal,
  }

  if (globalObject.clientRoutingIsDisabled) {
    redirectHard(urlOriginal)
    return
  }

  // Await hydration (unless +hydrationCanBeAborted)
  if (!isFirstRender) {
    await globalObject.hydrationAwaitPromise
    if (isRenderOutdated()) return
  }

  return await renderPageNominal()

  async function renderPageNominal() {
    const onError = async (err: unknown) => {
      await handleError({ err })
    }

    const pageContext = await getPageContextBegin(false, pageContextBeginArgs)
    if (isRenderOutdated()) return

    // Get pageContext serialized in <script id="vike_pageContext" type="application/json">
    if (isFirstRender) {
      const pageContextSerialized = await getPageContextFromHooksServer_firstRender(pageContext.abortSignal)
      // TO-DO/eventually: create helper assertPageContextFromHook()
      assert(!('urlOriginal' in pageContextSerialized))
      objectAssign(pageContext, pageContextSerialized)
      // TO-DO/pageContext-prefetch: remove or change, because this only makes sense for a pre-rendered page
      populatePageContextPrefetchCache(pageContext, { pageContextFromHooksServer: pageContextSerialized })
    }

    // Route
    // - We must also run it upon hydration to call the onBeforeRoute() hook, which is needed for i18n URL locale extraction.
    {
      let pageContextFromRoute: Awaited<ReturnType<typeof route>>
      try {
        pageContextFromRoute = await route(pageContext)
      } catch (err) {
        // throw abort()
        if (isAbortError(err) && err._pageContextAbort._navAbort && !isFirstRender) {
          if (isRenderOutdated()) return
          // Undo the URL change — upon back/forward navigation, the browser changes the URL
          if (isHistoryNavigation) undoHistoryNavigation(isBackwardNavigation)
          return
        }
        await onError(err)
        return
      }
      if (isRenderOutdated()) return

      // TO-DO/eventually: create helper assertPageContextFromHook()
      assert(!('urlOriginal' in pageContextFromRoute))
      if (isFirstRender) {
        // Set pageContext properties set by onBeforeRoute()
        // - But we skip pageId and routeParams because routing may have been aborted by a server-side `throw render()`
        const { pageId: _, routeParams: __, ...rest } = pageContextFromRoute
        objectAssign(pageContext, rest)
        assert(hasProp(pageContext, 'routeParams', 'string{}')) // Help TS
      } else {
        objectAssign(pageContext, pageContextFromRoute)
      }

      if (!isFirstRender) {
        if (!pageContextFromRoute.pageId) {
          /*
          // We don't use the client router to render the 404 page:
          //  - So that the +redirects setting (https://vike.dev/redirects) can be applied.
          //    - This is the main argument.
          //    - See also failed CI: https://github.com/vikejs/vike/pull/1871
          //  - So that server-side error tracking can track 404 links?
          //    - We do use the client router for rendering the error page, so I don't think this is much of an argument.
          await renderErrorPage({ is404: true })
          */
          redirectHard(urlOriginal)
          return
        }

        const isClientRoutable = await isClientSideRoutable(pageContextFromRoute.pageId, pageContext)
        if (isRenderOutdated()) return
        if (!isClientRoutable) {
          redirectHard(urlOriginal)
          return
        }

        const isSamePage =
          pageContextFromRoute.pageId &&
          previousPageContext?.pageId &&
          pageContextFromRoute.pageId === previousPageContext.pageId
        if (doNotRenderIfSamePage && isSamePage) {
          // Skip's Vike's rendering; let the user handle the navigation
          return
        }
      }
    }
    assert(hasProp(pageContext, 'pageId', 'string')) // Help TS

    // We commit the navigation after routing, because a navigation can be reverted by:
    // - `throw abort()` during routing — https://vike.dev/onBeforeRoute#throw-abort
    // - `doNotRenderIfSamePage` navigation to the shown page (it leaves the shown page untouched)
    await commitNavigation(abortController)
    if (isRenderOutdated()) return

    globalObject.currentPageContext = pageContext
    addLinkPrefetchHandlers_unwatch()

    // onPageTransitionStart()
    if (globalObject.isFirstRenderDone) {
      assert(previousPageContext)
      // We use the hook of the previous page in order to be able to call onPageTransitionStart() before fetching the files of the next page.
      // https://github.com/vikejs/vike/issues/1560
      // We call it after routing so that it isn't called when Vike doesn't render the next page (e.g. `doNotRenderIfSamePage`).
      // https://github.com/vikejs/vike/issues/2927
      if (!globalObject.isTransitioning) {
        globalObject.isTransitioning = true
        const hooks = getHooksFromPageContextNew('onPageTransitionStart', previousPageContext)
        try {
          await execHookList(hooks, pageContext, getPageContextPublicClientMinimal)
        } catch (err) {
          await onError(err)
          return
        }
        if (isRenderOutdated()) return
      }
    }

    const res = await loadPageConfigsLazyClientSideAndExecHook(pageContext, isFirstRender, isRenderOutdated)
    /* Already called inside loadPageConfigsLazyClientSideAndExecHook()
    if (isRenderOutdated()) return
    */
    if (res.skip) return
    if ('err' in res) {
      await onError(res.err)
      return
    }
    updateType(pageContext, res.pageContext)
    setPageContextCurrent(pageContext)

    // Set global hydrationCanBeAborted
    if (pageContext.exports.hydrationCanBeAborted) {
      setHydrationCanBeAborted()
    } else {
      if (globalThis.__VIKE__IS_DEV) {
        assertWarning(
          !isReact(),
          'You seem to be using React; we recommend setting hydrationCanBeAborted to true, see https://vike.dev/hydrationCanBeAborted',
          { onlyOnce: true },
        )
      }
    }
    // There wasn't any `await` but the isRenderOutdated() return value may have changed because we called setHydrationCanBeAborted()
    if (isRenderOutdated()) return

    // Get pageContext from hooks (fetched from server, and/or directly called on the client-side)
    if (isFirstRender) {
      assert(hasProp(pageContext, '_hasPageContextFromServer', 'true'))
      let pageContextAugmented: Awaited<ReturnType<typeof getPageContextFromHooksClient_firstRender>>
      try {
        pageContextAugmented = await getPageContextFromHooksClient_firstRender(pageContext)
      } catch (err) {
        await onError(err)
        return
      }
      if (isRenderOutdated()) return
      updateType(pageContext, pageContextAugmented)

      // Render page view
      return await renderPageView(pageContext)
    } else {
      // Fetch pageContext from server-side hooks
      let pageContextFromHooksServer: PageContextFromHooksServer
      const pageContextPrefetched = getPageContextPrefetched(pageContext)
      if (pageContextPrefetched) {
        pageContextFromHooksServer = pageContextPrefetched
      } else {
        try {
          const result = await getPageContextFromHooksServer(pageContext, false)
          if (result.is404ServerSideRouted) return
          pageContextFromHooksServer = result.pageContextFromHooksServer
          // TO-DO/pageContext-prefetch: remove or change, because this only makes sense for a pre-rendered page
          populatePageContextPrefetchCache(pageContext, result)
        } catch (err) {
          await onError(err)
          return
        }
      }
      if (isRenderOutdated()) return
      // TO-DO/eventually: create helper assertPageContextFromHook()
      assert(!('urlOriginal' in pageContextFromHooksServer))
      objectAssign(pageContext, pageContextFromHooksServer)

      // Get pageContext from client-side hooks
      let pageContextFromHooksClient: Awaited<ReturnType<typeof getPageContextFromHooksClient>>
      try {
        pageContextFromHooksClient = await getPageContextFromHooksClient(pageContext, false)
      } catch (err) {
        await onError(err)
        return
      }
      if (isRenderOutdated()) return
      updateType(pageContext, pageContextFromHooksClient)

      return await renderPageView(pageContext)
    }
  }

  // When the normal page threw an error:
  // - Can be a URL rewrite upon `throw render('/some-url')`
  // - Can be rendering the error page
  // - Can be rendering Vike's generic error page (if no error page is defined, or if the error page throws an error)
  async function handleError(args: { err: unknown }) {
    const { err } = args
    assert(err)

    // Logging
    if (!isAbortError(err)) {
      // We don't swallow 404 errors:
      //  - On the server-side, Vike swallows / doesn't show any 404 error log because it's expected that a user may go to some random non-existent URL. (We don't want to flood the app's error tracking with 404 logs.)
      //  - On the client-side, if the user navigates to a 404 then it means that the UI has a broken link. (It isn't expected that users can go to some random URL using the client-side router, as it would require, for example, the user to manually change the URL of a link by manually manipulating the DOM which highly unlikely.)
      logErrorClient(err, abortController.signal)
    } else {
      // We swallow throw redirect()/render() called by client-side hooks onBeforeRender()/data()/guard()
      // We handle the abort error down below.
    }

    // pageContext
    const pageContext = await getPageContextBegin(true, pageContextBeginArgs)
    if (isRenderOutdated()) return
    // We also call commitNavigation() here, because the error may have been thrown during routing before the commitNavigation() above was called
    await commitNavigation(abortController)
    if (isRenderOutdated()) return
    objectAssign(pageContext, {
      errorWhileRendering: err,
    })

    // throw redirect()/render()
    let pageContextAbort: undefined | PageContextAbort
    if (isAbortError(err)) {
      const res = await handleAbort(err, pageContext)
      if (res.skip) return
      pageContextAbort = res.pageContextAbort
    }

    // Render error page
    await renderErrorPage(pageContext, args, pageContextAbort)
  }

  async function renderErrorPage(
    pageContext: PageContextBegin,
    args: { err: unknown },
    pageContextAbort: PageContextAbort | undefined,
  ) {
    const onError = (err: unknown) => {
      /* When we can't render the error page, we prefer showing a blank page over letting the server-side try because otherwise:
         - We risk running into an infinite loop of reloads which would overload the server.
         - An infinite reloading page is a even worse UX than a blank page.
      redirectHard(urlOriginal)
      */
      logErrorClient(err, abortController.signal)
    }

    const errorPageId = getErrorPageId(pageContext._pageFilesAll, pageContext._globalContext._pageConfigs)
    if (!errorPageId) throw new Error('No error page defined.')
    objectAssign(pageContext, {
      pageId: errorPageId,
      routeParams: {},
    })
    globalObject.currentPageContext = pageContext

    // throw render(statusCode)
    if (pageContextAbort) {
      assert(pageContextAbort.abortStatusCode)
      assert(!('urlOriginal' in pageContextAbort))
      objectAssign(pageContext, pageContextAbort)
      objectAssign(pageContext, { is404: pageContextAbort.abortStatusCode === 404 })
    } else {
      objectAssign(pageContext, { is404: false })
    }

    if (import.meta.env.DEV || globalThis.__VIKE__IS_DEBUG) {
      assertInfo(false, `Rendering error page ${errorPageId}`, { onlyOnce: false })
    }

    const res = await loadPageConfigsLazyClientSideAndExecHook(pageContext, isFirstRender, isRenderOutdated)
    /* Already called inside loadPageConfigsLazyClientSideAndExecHook()
    if (isRenderOutdated()) return
    */
    if (res.skip) return
    if ('err' in res) {
      onError(res.err)
      return
    }
    updateType(pageContext, res.pageContext)
    setPageContextCurrent(pageContext)

    let pageContextFromHooksServer: PageContextFromHooksServer
    try {
      const result = await getPageContextFromHooksServer(pageContext, true)
      if (result.is404ServerSideRouted) return
      pageContextFromHooksServer = result.pageContextFromHooksServer
    } catch (err: unknown) {
      onError(err)
      return
    }
    if (isRenderOutdated()) return
    // TO-DO/eventually: create helper assertPageContextFromHook()
    assert(!('urlOriginal' in pageContextFromHooksServer))
    objectAssign(pageContext, pageContextFromHooksServer)

    let pageContextFromHooksClient: Awaited<ReturnType<typeof getPageContextFromHooksClient>>
    try {
      pageContextFromHooksClient = await getPageContextFromHooksClient(pageContext, true)
    } catch (err: unknown) {
      onError(err)
      return
    }
    if (isRenderOutdated()) return
    updateType(pageContext, pageContextFromHooksClient)

    await renderPageView(pageContext, args)
  }

  async function handleAbort(
    err: ErrorAbort,
    pageContext: PageContextBegin,
  ): Promise<{ skip: true; pageContextAbort?: undefined } | { pageContextAbort: PageContextAbort; skip?: undefined }> {
    const errAbort = err
    logAbort(err, !import.meta.env.DEV, pageContext)
    const pageContextAbort = errAbort._pageContextAbort

    addNewPageContextAborted(pageContextsAborted, pageContext, pageContextAbort, getPageContextPublicClientMinimal)

    if (
      // save client-side KBs
      globalThis.__VIKE__IS_DEV
    ) {
      assertUsage(
        !pageContextAbort._navAbort,
        '`throw abort()` can only be used in onBeforeRoute() upon client-side navigation (not upon hydration) — see https://vike.dev/onBeforeRoute#throw-abort',
      )
    }

    // throw render('/some-url')
    if (pageContextAbort._urlRewrite) {
      await renderPageClient({
        ...renderArgs,
        scrollTarget: undefined,
        pageContextsAborted,
      })
      return { skip: true }
    }

    // throw redirect('/some-url')
    if (pageContextAbort._urlRedirect) {
      const urlRedirect = pageContextAbort._urlRedirect.url
      if (!urlRedirect.startsWith('/')) {
        // External redirection
        redirectHard(urlRedirect)
        return { skip: true }
      } else {
        await renderPageClient({
          ...renderArgs,
          scrollTarget: undefined,
          urlOriginal: urlRedirect,
          overwriteLastHistoryEntry: false,
          pageContextsAborted,
        })
      }
      return { skip: true }
    }

    // throw render(statusCode)
    return { pageContextAbort }
  }

  async function renderPageView(
    pageContext: PageContextBeforeRenderClient &
      PageContextBegin & {
        urlPathname: string
        _hasPageContextFromServer: boolean
      } & PageContextRouted,
    isErrorPage?: { err?: unknown },
  ) {
    const onError = async (err: unknown) => {
      if (!isErrorPage) {
        await handleError({ err })
      } else {
        logErrorClient(err, abortController.signal)
      }
    }

    changeUrl(urlOriginal, overwriteLastHistoryEntry)
    {
      const previousPageContextBefore = globalObject.renderedPageContext?.previousPageContext
      // Remove previousPageContext of past pages (otherwise all the past pageContext are kept in memory)
      if (previousPageContextBefore) previousPageContextBefore.previousPageContext = null
    }
    globalObject.previousPageContext = pageContext
    // There should never be concurrent onRenderClient() calls
    assert(globalObject.onRenderClientPreviousPromise === undefined)
    setOnRenderClientCalled()
    const onRenderClientPromise = (async () => {
      let onRenderClientError: unknown
      try {
        await execHookOnRenderClient(pageContext, getPageContextPublicClient)
      } catch (err) {
        assert(err)
        onRenderClientError = err
      }
      globalObject.onRenderClientPreviousPromise = undefined
      globalObject.isFirstRenderDone = true
      return onRenderClientError
    })()
    globalObject.onRenderClientPreviousPromise = onRenderClientPromise
    const onRenderClientError = await onRenderClientPromise
    if (onRenderClientError) {
      await onError(onRenderClientError)
      if (!isErrorPage) return
    }
    /* We don't abort in order to ensure that onHydrationEnd() is called: we abort only after onHydrationEnd() is called.
    if (isRenderOutdated(true)) return
    */

    // onHydrationEnd()
    if (isFirstRender && !onRenderClientError) {
      try {
        await execHook('onHydrationEnd', pageContext, getPageContextPublicClient)
      } catch (err) {
        await onError(err)
        if (!isErrorPage) return
      }
      if (isRenderOutdated(true)) return
    }

    // We purposely abort *after* onHydrationEnd() is called (see comment above).
    if (isRenderOutdated(true)) return

    // onPageTransitionEnd()
    if (globalObject.isTransitioning) {
      globalObject.isTransitioning = undefined
      assert(previousPageContext)
      const hooks = getHooksFromPageContextNew('onPageTransitionEnd', previousPageContext)
      try {
        await execHookList(hooks, pageContext, getPageContextPublicClient)
      } catch (err) {
        await onError(err)
        if (!isErrorPage) return
      }
      if (isRenderOutdated(true)) return
    }

    if (!scrollTarget && previousPageContext) {
      const keepScrollPositionPrev = getKeepScrollPositionSetting(previousPageContext)
      const keepScrollPositionNext = getKeepScrollPositionSetting(pageContext)
      if (
        keepScrollPositionNext !== false &&
        keepScrollPositionPrev !== false &&
        areKeysEqual(keepScrollPositionNext, keepScrollPositionPrev)
      ) {
        scrollTarget = { preserveScroll: true }
      }
    }

    // Page scrolling
    setScrollPosition(scrollTarget, urlOriginal)
    if (isScrollPosition(scrollTarget)) {
      // Restore window.history.state.vike.scrollPosition (in case scrolling occurred during rendering)
      saveScrollPosition(scrollTarget)
    }
    scrollRestoration_initialRenderIsDone()

    if (pageContext._hasPageContextFromServer) setPageContextInitIsPassedToClient(pageContext)

    // Add link prefetch handlers
    addLinkPrefetchHandlers_watch()
    addLinkPrefetchHandlers()

    globalObject.renderedPageContext = pageContext

    stampFinished(urlOriginal)

    globalObject.hydrationAwaitPromiseResolve()

    return pageContext
  }
}

async function getPageContextBegin(
  isForErrorPage: boolean,
  {
    urlOriginal,
    isBackwardNavigation,
    isHistoryNavigation,
    pageContextsAborted,
    isClientSideNavigation,
    pageContextInitClient,
    isFirstRender,
    abortSignal,
  }: {
    urlOriginal: string
    isBackwardNavigation: boolean | null
    isHistoryNavigation: boolean
    pageContextsAborted: PageContextAborted[]
    isClientSideNavigation: boolean
    pageContextInitClient: Record<string, unknown> | undefined
    isFirstRender: boolean
    abortSignal: AbortSignal
  },
) {
  const previousPageContext = globalObject.previousPageContext
    ? getPageContextPublicClient(globalObject.previousPageContext)
    : null
  const pageContext = await createPageContextClient(urlOriginal)
  objectAssign(pageContext, {
    isBackwardNavigation,
    isHistoryNavigation,
    isClientSideNavigation,
    isHydration: isFirstRender && !isForErrorPage,
    previousPageContext,
    pageContextsAborted,
    abortSignal,
    ...pageContextInitClient,
  })

  // TO-DO/next-major-release: remove
  Object.defineProperty(pageContext, '_previousPageContext', {
    get() {
      assertWarning(false, 'pageContext._previousPageContext has been renamed pageContext.previousPageContext', {
        showStackTrace: true,
        onlyOnce: true,
      })
      return this.previousPageContext
    },
    enumerable: false,
  })

  {
    const pageContextAddendumAbort = getPageContextAddendumAbort(pageContextsAborted)
    assert(!pageContextAddendumAbort || !('urlOriginal' in pageContextAddendumAbort))
    objectAssign(pageContext, pageContextAddendumAbort)
  }
  return pageContext
}

// For Vike tests (but also potentially for Vike users)
// https://github.com/vikejs/vike/blob/ffbc5cf16407bcc075f414447e50d997c87c0c94/test/playground/pages/nested-layout/e2e-test.ts#L59
function stampFinished(urlOriginal: string) {
  window._vike ??= {}
  window._vike.fullyRenderedUrl = urlOriginal
}
declare global {
  var _vike: VikeGlobalInternal
}

function disableClientRouting(err: unknown, logError: boolean) {
  globalObject.clientRoutingIsDisabled = true

  assert(isErrorFetchingStaticAssets(err))
  if (logError) console.log(err) // We purposely don't use console.error() to avoid flooding error trackers such as Sentry

  assertInfo(
    false,
    'Failed to fetch static asset (due to a connection issue, or a new deployment) — falling back to Server Routing',
    { onlyOnce: true },
  )
}

function getIsRenderOutdated(abortController: AbortController) {
  const renderNumber = ++globalObject.renderCounter
  assert(renderNumber >= 1)

  let hydrationCanBeAborted = false
  const setHydrationCanBeAborted = () => {
    hydrationCanBeAborted = true
    globalObject.hydrationAwaitPromiseResolve()
  }

  let onRenderClientCalled = false
  const setOnRenderClientCalled = () => {
    onRenderClientCalled = true
  }

  /** Whether the rendering should be aborted because a new rendering has started. We should call this after each `await`. */
  // TODO/after-merge: rename to abortIfOutdated()
  const isRenderOutdated = (isRenderCleanup?: true) => {
    // Never abort first render if `hydrationCanBeAborted` isn't `true`
    {
      const isFirstRender = renderNumber === 1
      if (isFirstRender && !hydrationCanBeAborted && !isRenderCleanup) {
        return false
      }
    }

    // If there is a newer rendering, we should abort all previous renderings
    const isOutdated = renderNumber !== globalObject.renderCounter
    // Nothing renders this navigation anymore => we call `pageContext.abortSignal.abort()`
    // - Only until +onRenderClient was called:
    //   - Before +onRenderClient, this navigation is aborted (via `return`) and didn't render => always call `pageContext.abortSignal.abort()`
    //   - After +onRenderClient, its page may already be shown and stays shown if the newer navigation is cancelled (`throw abort()`), so we let `abortPreviousNavigation()` of the next navigation call `pageContext.abortSignal.abort()` instead of doing it here
    if (isOutdated && !onRenderClientCalled) abortController.abort() // i.e. pageContext.abortSignal.abort()
    return isOutdated
  }

  return {
    isRenderOutdated,
    setHydrationCanBeAborted,
    setOnRenderClientCalled,
    isFirstRender: renderNumber === 1,
  }
}
function getRenderCount(): number {
  return globalObject.renderCounter
}

// Once the navigation is committed the navigation cannot be reverted:
// - The user cannot `throw abort()` anymore — see https://vike.dev/onBeforeRoute#throw-abort
// - However, it can be superseded by a new navigation, i.e. the navigation can still be aborted via `if (isRenderOutdated()) return`
async function commitNavigation(abortController: AbortController) {
  // Call `pageContext.abortSignal.abort()` for the previous page
  abortPreviousNavigation(abortController)

  // Ensure no concurrent +onRenderClient calls
  // - We could `await globalObject.onRenderClientPreviousPromise` later just before execHookOnRenderClient() but we prefer doing it early so that `getPageContext()` returns the pageContext of the next page and not the pageContext of the currently shown page (i.e. `getPageContext() === usePageContext()`)
  //   - Awaiting early might also prevent other potential issues (I don't know)
  await globalObject.onRenderClientPreviousPromise
}

// Call `pageContext.abortSignal.abort()` for the previous page
// - User hooks, e.g. +data, can use pageContext.abortSignal to stop — https://vike.dev/pageContext#abortSignal
//   - Also extensions, e.g. vike-react's +onRenderClient — https://vike.dev/onRenderClient#abort
// - Also aborts streamed pageContext values — https://vike.dev/passToClient#streaming
// - Also aborts the fetch() call that retrieves pageContext from the server
function abortPreviousNavigation(abortControllerNew: AbortController) {
  // A navigation may call abortPreviousNavigation() twice
  if (globalObject.abortController === abortControllerNew) return
  // Old abortController
  globalObject.abortController?.abort()
  // New abortController
  globalObject.abortController = abortControllerNew
}

function getKeepScrollPositionSetting(
  pageContext: PageContextPublicClient & PageContextRouted,
): false | string | string[] {
  const c = pageContext.from.configsStandard.keepScrollPosition
  if (!c) return false
  let val = c.value
  const configDefinedAt = c.definedAt
  assert(configDefinedAt)
  const routeParameterList = getRouteStringParameterList(configDefinedAt)
  if (isCallable(val))
    val = val(getPageContextPublicClient(pageContext), {
      configDefinedAt: c.definedAt,
      /* We don't pass routeParameterList because it's useless: the user knows the parameter list.
      routeParameterList
      */
    })
  if (val === true) {
    return [
      configDefinedAt,
      ...routeParameterList.map((param) => {
        const val = pageContext.routeParams[param]
        assert(val)
        return val
      }),
    ]
  }
  // We skip validation and type-cast instead of assertUsage() in order to save client-side KBs
  return val as any
}

function areKeysEqual(key1: string | string[], key2: string | string[]): boolean {
  if (key1 === key2) return true
  if (!Array.isArray(key1) || !Array.isArray(key2)) return false
  return key1.length === key2.length && key1.every((_, i) => key1[i] === key2[i])
}

/**
 * Get the `pageContext` object on the client-side.
 *
 * https://vike.dev/getPageContextClient
 */
function getPageContextClient(): PageContextClient | null {
  const pageContext = globalObject.currentPageContext
  if (!pageContext) return null
  return getPageContextPublicClient(pageContext as any) as any
}

// TODO/soon: check whether this is the right API
// https://github.com/vikejs/vike/pull/3640
/**
 * Creates a new `pageContext` for the page that `pageContext` renders, with the values of `pageContextFromServer` on top.
 * - `pageContext` is the `pageContext` of the page rendered last
 * - `pageContext` and `pageContextFromServer` aren't modified
 * - The new `pageContext` is the `pageContext.previousPageContext` of the next navigation, including a navigation that has already started
 * - Unless a navigation has started, `getPageContextClient()` returns the new `pageContext`
 */
function createPageContextFromServer_experimentalRSC(
  pageContext: PageContextClient,
  pageContextFromServer: Record<string, unknown>,
): PageContextClient {
  const pageContextFromServerCopy = { ...pageContextFromServer }
  processPageContextFromServer(pageContextFromServerCopy)
  const pageContextNew = forkPageContext(
    (pageContext as PageContextClient & { _originalObject: Record<string, unknown> })._originalObject,
  )
  objectAssign(pageContextNew, pageContextFromServerCopy)
  // A navigation reads previousPageContext when it starts, sets currentPageContext after routing, and sets previousPageContext when it renders
  if (globalObject.currentPageContext === globalObject.previousPageContext) {
    globalObject.currentPageContext = pageContextNew
  } else {
    globalObject.currentPageContext!.previousPageContext = getPageContextPublicClient(pageContextNew as any)
  }
  globalObject.previousPageContext = pageContextNew as PreviousPageContext
  return getPageContextPublicClient(pageContextNew as any) as any
}

type PageContextExecuteHook = Omit<
  PageContextPublicClient,
  keyof Awaited<ReturnType<typeof loadPageConfigsLazyClientSide>>
>
async function loadPageConfigsLazyClientSideAndExecHook<
  PageContext extends PageContext_loadPageConfigsLazyClientSide & PageContextExecuteHook & PageContextCreatedClient,
>(pageContext: PageContext, isFirstRender: boolean, isRenderOutdated: () => boolean) {
  let hasErr = false
  let err: unknown

  let pageContextAddendum: Awaited<ReturnType<typeof loadPageConfigsLazyClientSide>>
  try {
    pageContextAddendum = await loadPageConfigsLazyClientSide(
      pageContext.pageId,
      pageContext._pageFilesAll,
      pageContext._globalContext._pageConfigs,
      pageContext._globalContext._pageConfigGlobal,
    )
  } catch (err_) {
    err = err_
    hasErr = true
  }
  if (isRenderOutdated()) return { skip: true }
  if (hasErr) {
    if (await handleErrorFetchingStaticAssets(err, pageContext, isFirstRender)) return { skip: true }
    return { err }
  }
  objectAssign(pageContext, pageContextAddendum!)

  try {
    await execHook('onCreatePageContext', pageContext, getPageContextPublicClient)
  } catch (err_) {
    err = err_
    hasErr = true
  }
  if (isRenderOutdated()) return { skip: true }
  if (hasErr) return { err }

  return { pageContext }
}
async function handleErrorFetchingStaticAssets(
  err: unknown,
  pageContext: { urlOriginal: string },
  isFirstRender: boolean,
): Promise<boolean> {
  if (import.meta.env.DEV) return false
  if (!isErrorFetchingStaticAssets(err)) return false // Syntax error in user file

  // *******************************************
  // ******* The three possible actions ********
  // *******************************************

  /** Show Vike's error page */
  const showErrorPage = () => {
    disableClientRouting(err, false)
    // Vike handles the error like any other error: Vike logs it with `console.error()` and renders Vike's error page
    return false
  }
  /** Show the rendered HTML (with broken hydration) */
  const showCurrentBrokenPage = () => {
    disableClientRouting(err, false)
    // Abort rendering (and don't show error page), not gracefully: the error throws (i.e. the error is handled by the browser and shown in the browser's developer console)
    throw err
  }
  /** Do a full (re-)load of the page */
  const hardReload = (url?: string) => {
    disableClientRouting(err, true)
    if (url) {
      redirectHard(url)
    } else {
      // We use `location.reload()` instead of redirectHard(): navigating with `location.href = url` creates a `type: 'navigate'` entry, which would lead to an infinite reload loop — see isPageReload()
      window.location.reload()
    }
    // Abort rendering (and don't show error page), gracefully (i.e. without throwing nor logging any error)
    return true
  }

  // **************************
  // ******* The logic ********
  // **************************

  // Possible causes that lead to this point:
  // - New deployment
  // - Connection problem

  // === Client-side navigation ===
  // We hard load the next page:
  // - New deployment => fully reloading the website is exactly what we want
  // - Connection problem => next page isn't shown => only useful action is to try again with a hard reload
  //   - It's usually better to show the browser's offline page than to leave the user stuck on the old page. (This way, the user knows there's a connection problem instead of wondering whether the website is broken.)
  if (!isFirstRender) {
    return hardReload(pageContext.urlOriginal)
  }

  // === First render ===

  // Avoid infinite reload loop: we don't reload a page that was itself loaded by a reload
  if (isPageReload()) {
    if (isBlankPage()) {
      return showErrorPage()
    } else {
      return showCurrentBrokenPage()
    }
  }

  if (isBlankPage()) {
    return hardReload()
  } else {
    globalObject.clientRoutingIsDisabled = true // Eagerly disable before connection check
    if (!(await isConnectionDown())) {
      // Most likely a new deployment (or the connection is back): either way, reloading fixes the page
      return hardReload()
    } else {
      // - Reloading is counterproductive since it would likely get another connection error, resulting in either: the browser's offline page, or repeating this asset loading failure.
      // - Handling flaky connections is the browser's job (e.g. the user reloads the page)
      // - Showing the rendered HTML is usually more useful to the user (even when unhydrated thus broken) than showing Vike's error page
      return showCurrentBrokenPage()
    }
  }
}
// Whether fetching static assets fails because of the connection. (The error thrown by `import()` doesn't tell: it's the same whether a new frontend was deployed, i.e. the static assets don't exist anymore, or the connection is down.)
async function isConnectionDown(): Promise<boolean> {
  try {
    await fetch(window.location.href, {
      method: 'HEAD',
      cache: 'no-store',
      // On a flaky connection, the request may hang and succeed much later: we don't want to reload the page long after it was shown (e.g. while the user is filling a form)
      signal: AbortSignal.timeout(4000),
    })
    // The server responds
    return false
  } catch {
    return true
  }
}
// The page shows nothing (e.g. SPA)
function isBlankPage(): boolean {
  return !document.body.innerText.trim()
}
// Whether the current page was loaded by a page reload
function isPageReload(): boolean {
  // The browser records how the current document was loaded (Navigation Timing API)
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  return (
    // Cannot be determined (e.g. older browsers)
    !navigation ||
    // A document loaded by `location.reload()` has `type: 'reload'`
    navigation.type === 'reload'
  )
}

// [HMR] If error page is shown => re-render whole page
if (import.meta.env.DEV && import.meta.hot)
  import.meta.hot.on('vite:afterUpdate', () => {
    const pageContext = globalObject.renderedPageContext
    if (pageContext?.pageId && isErrorPage(pageContext.pageId, pageContext._globalContext._pageConfigs)) {
      renderPageClient({
        scrollTarget: { preserveScroll: false },
        urlOriginal: getCurrentUrl(),
        overwriteLastHistoryEntry: true,
      })
    }
  })
