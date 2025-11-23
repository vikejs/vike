export { renderPageClientSide }
export { getRenderCount }
export { disableClientRouting }
export { firstRenderStartPromise }
export { getPageContextClient }
export type { PageContextBegin }
export type { PageContextInternalClientAfterRender }

import {
  assert,
  objectAssign,
  redirectHard,
  getGlobalObject,
  hasProp,
  updateType,
  genPromise,
  isCallable,
  catchInfiniteLoop,
} from './utils.js'
import {
  getPageContextFromClientHooks,
  getPageContextFromServerHooks,
  getPageContextFromHooks_isHydration,
  getPageContextFromHooks_serialized,
  type PageContextFromServerHooks,
  setPageContextInitIsPassedToClient,
} from './getPageContextFromHooks.js'
import { createPageContextClientSide } from './createPageContextClientSide.js'
import {
  addLinkPrefetchHandlers,
  addLinkPrefetchHandlers_unwatch,
  addLinkPrefetchHandlers_watch,
  getPageContextPrefetched,
  populatePageContextPrefetchCache,
} from './prefetch.js'
import { assertInfo, assertWarning, isReact } from './utils.js'
import { type PageContextBeforeRenderClient, execHookOnRenderClient } from '../shared/execHookOnRenderClient.js'
import {
  isErrorFetchingStaticAssets,
  loadPageConfigsLazyClientSide,
  PageContext_loadPageConfigsLazyClientSide,
} from '../shared/loadPageConfigsLazyClientSide.js'
import { pushHistoryState } from './history.js'
import {
  assertNoInfiniteAbortLoop,
  type ErrorAbort,
  getPageContextAddendumFromAbort,
  isAbortError,
  logAbortErrorHandled,
  PageContextAbort,
  type PageContextAborted,
} from '../../shared/route/abort.js'
import { route } from '../../shared/route/index.js'
import { isClientSideRoutable } from './isClientSideRoutable.js'
import { setScrollPosition, type ScrollTarget } from './setScrollPosition.js'
import { scrollRestoration_initialRenderIsDone } from './scrollRestoration.js'
import { getErrorPageId, isErrorPage } from '../../shared/error-page.js'
import type { PageContextConfig } from '../../shared/getPageFiles.js'
import { setPageContextCurrent } from './getPageContextCurrent.js'
import { getRouteStringParameterList } from '../../shared/route/resolveRouteString.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'
import type { PageContextClient, PageContextInternalClient } from '../../types/PageContext.js'
import { execHookDirect, type PageContextExecHook, execHook } from '../../shared/hooks/execHook.js'
import {
  type PageContextForPublicUsageClient,
  preparePageContextForPublicUsageClient,
} from './preparePageContextForPublicUsageClient.js'
import { getHookFromPageContextNew } from '../../shared/hooks/getHook.js'
import { preparePageContextForPublicUsageClientMinimal } from '../shared/preparePageContextForPublicUsageClientShared.js'
import type { VikeGlobalInternal } from '../../types/VikeGlobalInternal.js'
import { logErrorClient } from './logErrorClient.js'

type PageContextInternalClientAfterRender = NonNullable<Awaited<ReturnType<typeof renderPageClientSide>>>

const globalObject = getGlobalObject<{
  clientRoutingIsDisabled?: true
  renderCounter: number
  onRenderClientPreviousPromise?: Promise<unknown>
  isFirstRenderDone?: true
  isTransitioning?: true
  //https://vike.dev/pageContext#previousPageContext
  previousPageContext?: PreviousPageContext
  renderedPageContext?: PageContextInternalClient & PageContext_loadPageConfigsLazyClientSide
  firstRenderStartPromise: Promise<void>
  firstRenderStartPromiseResolve: () => void
}>(
  'runtime-client-routing/renderPageClientSide.ts',
  (() => {
    const { promise: firstRenderStartPromise, resolve: firstRenderStartPromiseResolve } = genPromise()
    return {
      renderCounter: 0,
      firstRenderStartPromise,
      firstRenderStartPromiseResolve,
    }
  })(),
)
const { firstRenderStartPromise } = globalObject
type PreviousPageContext = { pageId: string } & PageContextConfig &
  PageContextRouted &
  PageContextExecHook &
  PageContextForPublicUsageClient
type PageContextRouted = { pageId: string; routeParams: Record<string, string> }

type PageContextBegin = Awaited<ReturnType<typeof getPageContextBegin>>

type RenderArgs = {
  scrollTarget: ScrollTarget
  isBackwardNavigation?: boolean | null // `null` when window.history.state.timestamp is missing
  isHistoryNavigation?: true
  urlOriginal?: string
  overwriteLastHistoryEntry?: boolean
  pageContextsAborted?: PageContextAborted[]
  doNotRenderIfSamePage?: boolean
  isClientSideNavigation?: boolean
  pageContextInitClient?: Record<string, unknown>
}
async function renderPageClientSide(renderArgs: RenderArgs) {
  catchInfiniteLoop('renderPageClientSide()')

  const {
    urlOriginal = getCurrentUrl(),
    overwriteLastHistoryEntry = false,
    isBackwardNavigation = false,
    isHistoryNavigation = false,
    doNotRenderIfSamePage,
    isClientSideNavigation = true,
    pageContextInitClient,
  } = renderArgs
  let { scrollTarget, pageContextsAborted = [] } = renderArgs
  const { previousPageContext } = globalObject

  addLinkPrefetchHandlers_unwatch()

  const { isRenderOutdated, setHydrationCanBeAborted, isFirstRender } = getIsRenderOutdated()
  /* TODO/now
  assertNoInfiniteAbortLoop(
    pageContextsAborted.filter((abort) => '_urlRewrite' in abort).length,
    pageContextsAborted.filter((abort) => '_urlRedirect' in abort).length,
  )
  */

  const pageContextBeginArgs = {
    urlOriginal,
    isBackwardNavigation,
    isHistoryNavigation,
    pageContextsAborted,
    isClientSideNavigation,
    pageContextInitClient,
    isFirstRender,
  }

  if (globalObject.clientRoutingIsDisabled) {
    redirectHard(urlOriginal)
    return
  }

  globalObject.firstRenderStartPromiseResolve()
  if (isRenderOutdated()) return

  return await renderPageNominal()

  async function renderPageNominal() {
    const onError = async (err: unknown) => {
      await handleError({ err })
    }

    const pageContext = await getPageContextBegin(false, pageContextBeginArgs)
    if (isRenderOutdated()) return

    // onPageTransitionStart()
    if (globalObject.isFirstRenderDone) {
      assert(previousPageContext)
      // We use the hook of the previous page in order to be able to call onPageTransitionStart() before fetching the files of the next page.
      // https://github.com/vikejs/vike/issues/1560
      if (!globalObject.isTransitioning) {
        globalObject.isTransitioning = true
        const hooks = getHookFromPageContextNew('onPageTransitionStart', previousPageContext)
        try {
          await execHookDirect(hooks, pageContext, preparePageContextForPublicUsageClientMinimal)
        } catch (err) {
          await onError(err)
          return
        }
        if (isRenderOutdated()) return
      }
    }

    // Get pageContext serialized in <script id="vike_pageContext" type="application/json">
    if (isFirstRender) {
      const pageContextSerialized = getPageContextFromHooks_serialized()
      // TO-DO/eventually: create helper assertPageContextFromHook()
      assert(!('urlOriginal' in pageContextSerialized))
      objectAssign(pageContext, pageContextSerialized)
      // TO-DO/pageContext-prefetch: remove or change, because this only makes sense for a pre-rendered page
      populatePageContextPrefetchCache(pageContext, { pageContextFromServerHooks: pageContextSerialized })
    }

    // Route
    // - We must also run it upon hydration to call the onBeforeRoute() hook, which is needed for i18n URL locale extraction.
    {
      let pageContextFromRoute: Awaited<ReturnType<typeof route>>
      try {
        pageContextFromRoute = await route(pageContext)
      } catch (err) {
        await onError(err)
        return
      }
      if (isRenderOutdated()) return

      // TO-DO/eventually: create helper assertPageContextFromHook()
      assert(!('urlOriginal' in pageContextFromRoute))
      if (isFirstRender) {
        // Set pageContext properties set by onBeforeRoute()
        // - But we skip pageId and routeParams because routing may have been aborted by a server-side `throw render()`
        const { pageId, routeParams, ...rest } = pageContextFromRoute
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
      assertWarning(
        !isReact(),
        'You seem to be using React; we recommend setting hydrationCanBeAborted to true, see https://vike.dev/hydrationCanBeAborted',
        { onlyOnce: true },
      )
    }
    // There wasn't any `await` but the isRenderOutdated() return value may have changed because we called setHydrationCanBeAborted()
    if (isRenderOutdated()) return

    // Get pageContext from hooks (fetched from server, and/or directly called on the client-side)
    if (isFirstRender) {
      assert(hasProp(pageContext, '_hasPageContextFromServer', 'true'))
      let pageContextAugmented: Awaited<ReturnType<typeof getPageContextFromHooks_isHydration>>
      try {
        pageContextAugmented = await getPageContextFromHooks_isHydration(pageContext)
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
      let pageContextFromServerHooks: PageContextFromServerHooks
      const pageContextPrefetched = getPageContextPrefetched(pageContext)
      if (pageContextPrefetched) {
        pageContextFromServerHooks = pageContextPrefetched
      } else {
        try {
          const result = await getPageContextFromServerHooks(pageContext, false)
          if (result.is404ServerSideRouted) return
          pageContextFromServerHooks = result.pageContextFromServerHooks
          // TO-DO/pageContext-prefetch: remove or change, because this only makes sense for a pre-rendered page
          populatePageContextPrefetchCache(pageContext, result)
        } catch (err) {
          await onError(err)
          return
        }
      }
      if (isRenderOutdated()) return
      // TO-DO/eventually: create helper assertPageContextFromHook()
      assert(!('urlOriginal' in pageContextFromServerHooks))
      objectAssign(pageContext, pageContextFromServerHooks)

      // Get pageContext from client-side hooks
      let pageContextFromClientHooks: Awaited<ReturnType<typeof getPageContextFromClientHooks>>
      try {
        pageContextFromClientHooks = await getPageContextFromClientHooks(pageContext, false)
      } catch (err) {
        await onError(err)
        return
      }
      if (isRenderOutdated()) return
      updateType(pageContext, pageContextFromClientHooks)

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
      logErrorClient(err)
    } else {
      // We swallow throw redirect()/render() called by client-side hooks onBeforeRender()/data()/guard()
      // We handle the abort error down below.
    }

    // pageContext
    const pageContext = await getPageContextBegin(true, pageContextBeginArgs)
    if (isRenderOutdated()) return
    objectAssign(pageContext, {
      errorWhileRendering: err,
    })

    // throw redirect()/render()
    let pageContextAbort: undefined | PageContextAbort
    if (isAbortError(err)) {
      const res = await handleAbortError(err, pageContext)
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
      logErrorClient(err)
    }

    const errorPageId = getErrorPageId(pageContext._pageFilesAll, pageContext._globalContext._pageConfigs)
    if (!errorPageId) throw new Error('No error page defined.')
    objectAssign(pageContext, {
      pageId: errorPageId,
      routeParams: {},
    })

    // throw render(statusCode)
    if (pageContextAbort) {
      assert(pageContextAbort.abortStatusCode)
      assert(!('urlOriginal' in pageContextAbort))
      objectAssign(pageContext, pageContextAbort)
      objectAssign(pageContext, { is404: pageContextAbort.abortStatusCode === 404 })
    } else {
      objectAssign(pageContext, { is404: false })
    }

    const isClientRoutable = await isClientSideRoutable(pageContext.pageId, pageContext)
    if (isRenderOutdated()) return
    if (!isClientRoutable) {
      redirectHard(urlOriginal)
      return
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

    let pageContextFromServerHooks: PageContextFromServerHooks
    try {
      const result = await getPageContextFromServerHooks(pageContext, true)
      if (result.is404ServerSideRouted) return
      pageContextFromServerHooks = result.pageContextFromServerHooks
    } catch (err: unknown) {
      onError(err)
      return
    }
    if (isRenderOutdated()) return
    // TO-DO/eventually: create helper assertPageContextFromHook()
    assert(!('urlOriginal' in pageContextFromServerHooks))
    objectAssign(pageContext, pageContextFromServerHooks)

    let pageContextFromClientHooks: Awaited<ReturnType<typeof getPageContextFromClientHooks>>
    try {
      pageContextFromClientHooks = await getPageContextFromClientHooks(pageContext, true)
    } catch (err: unknown) {
      onError(err)
      return
    }
    if (isRenderOutdated()) return
    updateType(pageContext, pageContextFromClientHooks)

    await renderPageView(pageContext, args)
  }

  async function handleAbortError(
    err: ErrorAbort,
    pageContext: PageContextBegin,
  ): Promise<{ skip: true; pageContextAbort?: undefined } | { pageContextAbort: PageContextAbort; skip?: undefined }> {
    const errAbort = err
    logAbortErrorHandled(err, !import.meta.env.DEV, pageContext)
    const pageContextAbort = errAbort._pageContextAbort

    objectAssign(pageContext, { _pageContextAbort: pageContextAbort })
    pageContextsAborted = [...pageContextsAborted, pageContext]

    // throw render('/some-url')
    if (pageContextAbort._urlRewrite) {
      await renderPageClientSide({
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
        // Add current URL to redirect chain before redirecting
        await renderPageClientSide({
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
        logErrorClient(err)
      }
    }

    // We use globalObject.onRenderClientPreviousPromise in order to ensure that there is never two concurrent onRenderClient() calls
    if (globalObject.onRenderClientPreviousPromise) {
      // Make sure that the previous render has finished
      await globalObject.onRenderClientPreviousPromise
      assert(globalObject.onRenderClientPreviousPromise === undefined)
      if (isRenderOutdated()) return
    }
    changeUrl(urlOriginal, overwriteLastHistoryEntry)
    globalObject.previousPageContext = pageContext
    assert(globalObject.onRenderClientPreviousPromise === undefined)
    const onRenderClientPromise = (async () => {
      let onRenderClientError: unknown
      try {
        await execHookOnRenderClient(pageContext, preparePageContextForPublicUsageClient)
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
    assert(globalObject.onRenderClientPreviousPromise === undefined)
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
        await execHook('onHydrationEnd', pageContext, preparePageContextForPublicUsageClient)
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
      const hooks = getHookFromPageContextNew('onPageTransitionEnd', previousPageContext)
      try {
        await execHookDirect(hooks, pageContext, preparePageContextForPublicUsageClient)
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
    scrollRestoration_initialRenderIsDone()

    if (pageContext._hasPageContextFromServer) setPageContextInitIsPassedToClient(pageContext)

    // Add link prefetch handlers
    addLinkPrefetchHandlers_watch()
    addLinkPrefetchHandlers()

    globalObject.renderedPageContext = pageContext

    stampFinished(urlOriginal)

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
  }: {
    urlOriginal: string
    isBackwardNavigation: boolean | null
    isHistoryNavigation: boolean
    pageContextsAborted: PageContextAborted[]
    isClientSideNavigation: boolean
    pageContextInitClient: Record<string, unknown> | undefined
    isFirstRender: boolean
  },
) {
  const previousPageContext = globalObject.previousPageContext ?? null
  const pageContext = await createPageContextClientSide(urlOriginal)
  objectAssign(pageContext, {
    isBackwardNavigation,
    isHistoryNavigation,
    isClientSideNavigation,
    isHydration: isFirstRender && !isForErrorPage,
    previousPageContext,
    ...pageContextInitClient,
  })

  // TO-DO/next-major-release: remove
  Object.defineProperty(pageContext, '_previousPageContext', {
    get() {
      assertWarning(false, 'pageContext._previousPageContext has been renamed pageContext.previousPageContext', {
        showStackTrace: true,
        onlyOnce: true,
      })
      return previousPageContext
    },
    enumerable: false,
  })

  {
    const pageContextAddendumFromAbort = getPageContextAddendumFromAbort(pageContextsAborted)
    assert(!('urlOriginal' in pageContextAddendumFromAbort))
    objectAssign(pageContext, pageContextAddendumFromAbort)
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

function changeUrl(url: string, overwriteLastHistoryEntry: boolean) {
  if (getCurrentUrl() === url) return
  pushHistoryState(url, overwriteLastHistoryEntry)
}

function disableClientRouting(err: unknown, log: boolean) {
  globalObject.clientRoutingIsDisabled = true

  assert(isErrorFetchingStaticAssets(err))
  if (log) {
    // We purposely don't use console.error() to avoid flooding error trackers such as Sentry
    console.log(err)
  }

  assertInfo(
    false,
    [
      'Failed to fetch static asset.',
      import.meta.env.PROD ? 'This usually happens when a new frontend is deployed.' : null,
      'Falling back to Server Routing.',
      '(The next page navigation will use Server Routing instead of Client Routing.)',
    ]
      .filter(Boolean)
      .join(' '),
    { onlyOnce: true },
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
    // Never abort first render if `hydrationCanBeAborted` isn't `true`
    {
      const isFirstRender = renderNumber === 1
      if (isFirstRender && !hydrationCanBeAborted && !isRenderCleanup) {
        return false
      }
    }

    // If there is a newer rendering, we should abort all previous renderings
    return renderNumber !== globalObject.renderCounter
  }

  return {
    isRenderOutdated,
    setHydrationCanBeAborted,
    isFirstRender: renderNumber === 1,
  }
}
function getRenderCount(): number {
  return globalObject.renderCounter
}

function getKeepScrollPositionSetting(
  pageContext: PageContextConfig & PageContextRouted & Record<string, unknown>,
): false | string | string[] {
  const c = pageContext.from.configsStandard.keepScrollPosition
  if (!c) return false
  let val = c.value
  const configDefinedAt = c.definedAt
  assert(configDefinedAt)
  const routeParameterList = getRouteStringParameterList(configDefinedAt)
  if (isCallable(val))
    val = val(pageContext, {
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
  return (globalObject.renderedPageContext as any) ?? null
}

type PageContextExecuteHook = Omit<
  PageContextForPublicUsageClient,
  keyof Awaited<ReturnType<typeof loadPageConfigsLazyClientSide>>
>
async function loadPageConfigsLazyClientSideAndExecHook<
  PageContext extends PageContext_loadPageConfigsLazyClientSide & PageContextExecuteHook,
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
    if (handleErrorFetchingStaticAssets(err, pageContext, isFirstRender)) {
      return { skip: true }
    } else {
      // Syntax error in user file
    }
  }
  if (isRenderOutdated()) return { skip: true }
  if (hasErr) return { err }
  objectAssign(pageContext, pageContextAddendum!)

  try {
    await execHook('onCreatePageContext', pageContext, preparePageContextForPublicUsageClient)
  } catch (err_) {
    err = err
    hasErr = true
  }
  if (isRenderOutdated()) return { skip: true }
  if (hasErr) return { err }

  return { pageContext }
}
function handleErrorFetchingStaticAssets(
  err: unknown,
  pageContext: { urlOriginal: string },
  isFirstRender: boolean,
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

  redirectHard(pageContext.urlOriginal)

  return true
}

// [HMR] If error page is shown => re-render whole page
if (import.meta.env.DEV && import.meta.hot)
  import.meta.hot.on('vite:afterUpdate', () => {
    const pageContext = globalObject.renderedPageContext
    if (pageContext?.pageId && isErrorPage(pageContext.pageId, pageContext._globalContext._pageConfigs)) {
      renderPageClientSide({
        scrollTarget: { preserveScroll: false },
        urlOriginal: getCurrentUrl(),
        overwriteLastHistoryEntry: true,
      })
    }
  })
