export { renderPageClientSide }
export { getRenderCount }
export { disableClientRouting }
export { firstRenderStartPromise }

import {
  assert,
  isSameErrorMessage,
  objectAssign,
  redirectHard,
  getGlobalObject,
  executeHook,
  hasProp,
  augmentType,
  genPromise,
  isCallable,
  catchInfiniteLoop
} from './utils.js'
import {
  getPageContextFromClientHooks,
  getPageContextFromServerHooks,
  getPageContextFromHooks_isHydration,
  getPageContextFromHooks_serialized,
  type PageContextFromServerHooks,
  setPageContextInitIsPassedToClient,
  PageContextFromClientHooks
} from './getPageContextFromHooks.js'
import { createPageContext } from './createPageContext.js'
import {
  addLinkPrefetchHandlers,
  addLinkPrefetchHandlers_unwatch,
  addLinkPrefetchHandlers_watch,
  getPageContextPrefetched,
  populatePageContextPrefetchCache
} from './prefetch.js'
import { assertInfo, assertWarning, isReact } from './utils.js'
import { type PageContextBeforeRenderClient, executeOnRenderClientHook } from '../shared/executeOnRenderClientHook.js'
import { assertHook, getHook } from '../../shared/hooks/getHook.js'
import { isErrorFetchingStaticAssets, loadUserFilesClientSide } from '../shared/loadUserFilesClientSide.js'
import { pushHistoryState } from './history.js'
import {
  assertNoInfiniteAbortLoop,
  getPageContextFromAllRewrites,
  isAbortError,
  logAbortErrorHandled,
  type PageContextFromRewrite
} from '../../shared/route/abort.js'
import { route } from '../../shared/route/index.js'
import { isClientSideRoutable } from './isClientSideRoutable.js'
import { setScrollPosition, type ScrollTarget } from './setScrollPosition.js'
import { scrollRestoration_initialRenderIsDone } from './scrollRestoration.js'
import { getErrorPageId } from '../../shared/error-page.js'
import type { PageConfigUserFriendly } from '../../shared/getPageFiles.js'
import { setPageContextCurrent } from './getPageContextCurrent.js'
import { getRouteStringParameterList } from '../../shared/route/resolveRouteString.js'
import { getCurrentUrl } from '../shared/getCurrentUrl.js'

const globalObject = getGlobalObject<{
  clientRoutingIsDisabled?: true
  renderCounter: number
  onRenderClientPreviousPromise?: Promise<unknown>
  isFirstRenderDone?: true
  isTransitioning?: true
  previousPageContext: PreviousPageContext | null
  firstRenderStartPromise: Promise<void>
  firstRenderStartPromiseResolve: () => void
}>(
  'renderPageClientSide.ts',
  (() => {
    const { promise: firstRenderStartPromise, resolve: firstRenderStartPromiseResolve } = genPromise()
    return {
      previousPageContext: null,
      renderCounter: 0,
      firstRenderStartPromise,
      firstRenderStartPromiseResolve
    }
  })()
)
const { firstRenderStartPromise } = globalObject
type PreviousPageContext = { pageId: string } & PageConfigUserFriendly & PageContextRouted
type PageContextRouted = { pageId: string; routeParams: Record<string, string> }

type RenderArgs = {
  scrollTarget: ScrollTarget
  isBackwardNavigation: boolean | null
  urlOriginal?: string
  overwriteLastHistoryEntry?: boolean
  pageContextsFromRewrite?: PageContextFromRewrite[]
  redirectCount?: number
  doNotRenderIfSamePage?: boolean
  isClientSideNavigation?: boolean
  pageContextInitClient?: Record<string, unknown>
}
async function renderPageClientSide(renderArgs: RenderArgs): Promise<void> {
  catchInfiniteLoop('renderPageClientSide()')

  const {
    urlOriginal = getCurrentUrl(),
    overwriteLastHistoryEntry = false,
    isBackwardNavigation,
    pageContextsFromRewrite = [],
    redirectCount = 0,
    doNotRenderIfSamePage,
    isClientSideNavigation = true,
    pageContextInitClient
  } = renderArgs
  let { scrollTarget } = renderArgs
  const { previousPageContext } = globalObject

  addLinkPrefetchHandlers_unwatch()

  const { isRenderOutdated, setHydrationCanBeAborted, isFirstRender } = getIsRenderOutdated()
  assertNoInfiniteAbortLoop(pageContextsFromRewrite.length, redirectCount)

  if (globalObject.clientRoutingIsDisabled) {
    redirectHard(urlOriginal)
    return
  }

  globalObject.firstRenderStartPromiseResolve()
  if (isRenderOutdated()) return

  await renderPageNominal()

  return

  async function renderPageNominal() {
    const onError = async (err: unknown) => {
      await renderErrorPage({ err })
    }

    const pageContext = await getPageContextBegin(false)
    if (isRenderOutdated()) return

    // onPageTransitionStart()
    if (globalObject.isFirstRenderDone) {
      assert(previousPageContext)
      // We use the hook of the previous page in order to be able to call onPageTransitionStart() before fetching the files of the next page.
      // https://github.com/vikejs/vike/issues/1560
      assertHook(previousPageContext, 'onPageTransitionStart')
      if (!globalObject.isTransitioning) {
        globalObject.isTransitioning = true
        const onPageTransitionStartHook = getHook(previousPageContext, 'onPageTransitionStart')
        if (onPageTransitionStartHook) {
          const hook = onPageTransitionStartHook
          const { hookFn } = hook
          try {
            await executeHook(() => hookFn(pageContext), hook, pageContext)
          } catch (err) {
            await onError(err)
            return
          }
          if (isRenderOutdated()) return
        }
      }
    }

    // Route
    if (isFirstRender) {
      const pageContextSerialized = getPageContextFromHooks_serialized()
      // TODO/eventually: create helper assertPageContextFromHook()
      assert(!('urlOriginal' in pageContextSerialized))
      objectAssign(pageContext, pageContextSerialized)
      // TODO/pageContext-prefetch: remove or change, because this only makes sense for a pre-rendered page
      populatePageContextPrefetchCache(pageContext, { pageContextFromServerHooks: pageContextSerialized })
    } else {
      let pageContextFromRoute: Awaited<ReturnType<typeof route>>
      try {
        pageContextFromRoute = await route(pageContext)
      } catch (err) {
        await onError(err)
        return
      }
      if (isRenderOutdated()) return

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
      assert(hasProp(pageContextFromRoute, 'pageId', 'string')) // Help TS

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

      // TODO/eventually: create helper assertPageContextFromHook()
      assert(!('urlOriginal' in pageContextFromRoute))
      objectAssign(pageContext, pageContextFromRoute)
    }

    try {
      objectAssign(
        pageContext,
        await loadUserFilesClientSide(
          pageContext.pageId,
          pageContext._pageFilesAll,
          pageContext._pageConfigs,
          pageContext._pageConfigGlobal
        )
      )
    } catch (err) {
      if (handleErrorFetchingStaticAssets(err, pageContext, isFirstRender)) {
        return
      } else {
        // A user file has a syntax error
        await onError(err)
        return
      }
    }
    if (isRenderOutdated()) return
    setPageContextCurrent(pageContext)

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
      augmentType(pageContext, pageContextAugmented)

      // Render page view
      await renderPageView(pageContext)
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
          // TODO/pageContext-prefetch: remove or change, because this only makes sense for a pre-rendered page
          populatePageContextPrefetchCache(pageContext, result)
        } catch (err) {
          await onError(err)
          return
        }
      }
      if (isRenderOutdated()) return
      // TODO/eventually: create helper assertPageContextFromHook()
      assert(!('urlOriginal' in pageContextFromServerHooks))
      objectAssign(pageContext, pageContextFromServerHooks)

      // Get pageContext from client-side hooks
      let pageContextFromClientHooks: PageContextFromClientHooks
      try {
        pageContextFromClientHooks = await getPageContextFromClientHooks(pageContext, false)
      } catch (err) {
        await onError(err)
        return
      }
      if (isRenderOutdated()) return
      augmentType(pageContext, pageContextFromClientHooks)

      await renderPageView(pageContext)
    }
  }

  async function getPageContextBegin(isForErrorPage: boolean) {
    const pageContext = await createPageContext(urlOriginal)
    objectAssign(pageContext, {
      isBackwardNavigation,
      isClientSideNavigation,
      isHydration: isFirstRender && !isForErrorPage,
      previousPageContext,
      ...pageContextInitClient
    })

    // TODO/next-major-release: remove
    Object.defineProperty(pageContext, '_previousPageContext', {
      get() {
        assertWarning(false, 'pageContext._previousPageContext has been renamed pageContext.previousPageContext', {
          showStackTrace: true,
          onlyOnce: true
        })
        return previousPageContext
      },
      enumerable: false
    })

    {
      const pageContextFromAllRewrites = getPageContextFromAllRewrites(pageContextsFromRewrite)
      assert(!('urlOriginal' in pageContextFromAllRewrites))
      objectAssign(pageContext, pageContextFromAllRewrites)
    }
    return pageContext
  }

  async function renderErrorPage(args: { err?: unknown; pageContextError?: Record<string, unknown>; is404?: boolean }) {
    const onError = (err: unknown) => {
      if (!isSameErrorMessage(err, args.err)) {
        /* When we can't render the error page, we prefer showing a blank page over letting the server-side try because otherwise:
           - We risk running into an infinite loop of reloads which would overload the server.
           - An infinite reloading page is a even worse UX than a blank page.
        redirectHard(urlOriginal)
        */
        console.error(err)
      }
    }

    if ('err' in args) {
      const { err } = args
      assert(err)

      if (!isAbortError(err)) {
        // We don't swallow 404 errors:
        //  - On the server-side, Vike swallows / doesn't show any 404 error log because it's expected that a user may go to some random non-existent URL. (We don't want to flood the app's error tracking with 404 logs.)
        //  - On the client-side, if the user navigates to a 404 then it means that the UI has a broken link. (It isn't expected that users can go to some random URL using the client-side router, as it would require, for example, the user to manually change the URL of a link by manually manipulating the DOM which highly unlikely.)
        console.error(err)
      } else {
        // We swallow throw redirect()/render() called by client-side hooks onBeforeRender()/data()/guard()
        // We handle the abort error down below.
      }
    }

    const pageContext = await getPageContextBegin(true)
    if (isRenderOutdated()) return

    if (args.is404) objectAssign(pageContext, { is404: true })
    if (args.pageContextError) objectAssign(pageContext, args.pageContextError)

    if ('err' in args) {
      const { err } = args
      assert(!('errorWhileRendering' in pageContext))
      pageContext.errorWhileRendering = err

      if (isAbortError(err)) {
        const errAbort = err
        logAbortErrorHandled(err, !import.meta.env.DEV, pageContext)
        const pageContextAbort = errAbort._pageContextAbort

        // throw render('/some-url')
        if (pageContextAbort._urlRewrite) {
          await renderPageClientSide({
            ...renderArgs,
            scrollTarget: undefined,
            pageContextsFromRewrite: [...pageContextsFromRewrite, pageContextAbort]
          })
          return
        }

        // throw redirect('/some-url')
        if (pageContextAbort._urlRedirect) {
          const urlRedirect = pageContextAbort._urlRedirect.url
          if (!urlRedirect.startsWith('/')) {
            // External redirection
            redirectHard(urlRedirect)
            return
          } else {
            await renderPageClientSide({
              ...renderArgs,
              scrollTarget: undefined,
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
    }

    const errorPageId = getErrorPageId(pageContext._pageFilesAll, pageContext._pageConfigs)
    if (!errorPageId) throw new Error('No error page defined.')
    objectAssign(pageContext, {
      pageId: errorPageId
    })

    const isClientRoutable = await isClientSideRoutable(pageContext.pageId, pageContext)
    if (isRenderOutdated()) return
    if (!isClientRoutable) {
      redirectHard(urlOriginal)
      return
    }

    try {
      objectAssign(
        pageContext,
        await loadUserFilesClientSide(
          pageContext.pageId,
          pageContext._pageFilesAll,
          pageContext._pageConfigs,
          pageContext._pageConfigGlobal
        )
      )
    } catch (err) {
      if (handleErrorFetchingStaticAssets(err, pageContext, isFirstRender)) {
        return
      } else {
        // A user file has a syntax error
        onError(err)
        return
      }
    }
    if (isRenderOutdated()) return
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
    // TODO/eventually: create helper assertPageContextFromHook()
    assert(!('urlOriginal' in pageContextFromServerHooks))
    objectAssign(pageContext, pageContextFromServerHooks)

    let pageContextFromClientHooks: PageContextFromClientHooks
    try {
      pageContextFromClientHooks = await getPageContextFromClientHooks(pageContext, true)
    } catch (err: unknown) {
      onError(err)
      return
    }
    if (isRenderOutdated()) return
    augmentType(pageContext, pageContextFromClientHooks)

    objectAssign(pageContext, { routeParams: {} })

    await renderPageView(pageContext, args)
  }

  async function renderPageView(
    pageContext: PageContextBeforeRenderClient & { urlPathname: string } & PageContextRouted,
    isErrorPage?: { err?: unknown }
  ) {
    const onError = async (err: unknown) => {
      if (!isErrorPage) {
        await renderErrorPage({ err })
      } else {
        if (!isSameErrorMessage(err, isErrorPage.err)) {
          console.error(err)
        }
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
        await executeOnRenderClientHook(pageContext, true)
      } catch (err) {
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
      assertHook(pageContext, 'onHydrationEnd')
      const hook = getHook(pageContext, 'onHydrationEnd')
      if (hook) {
        const { hookFn } = hook
        try {
          await executeHook(() => hookFn(pageContext), hook, pageContext)
        } catch (err) {
          await onError(err)
          if (!isErrorPage) return
        }
        if (isRenderOutdated(true)) return
      }
    }

    // We purposely abort *after* onHydrationEnd() is called (see comment above).
    if (isRenderOutdated(true)) return

    // onPageTransitionEnd()
    if (globalObject.isTransitioning) {
      globalObject.isTransitioning = undefined
      assert(previousPageContext)
      assertHook(previousPageContext, 'onPageTransitionEnd')
      const hook = getHook(previousPageContext, 'onPageTransitionEnd')
      if (hook) {
        const { hookFn } = hook
        try {
          await executeHook(() => hookFn(pageContext), hook, pageContext)
        } catch (err) {
          await onError(err)
          if (!isErrorPage) return
        }
        if (isRenderOutdated(true)) return
      }
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
  }
}

function changeUrl(url: string, overwriteLastHistoryEntry: boolean) {
  if (getCurrentUrl() === url) return
  pushHistoryState(url, overwriteLastHistoryEntry)
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

  redirectHard(pageContext.urlOriginal)

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
    isFirstRender: renderNumber === 1
  }
}
function getRenderCount(): number {
  return globalObject.renderCounter
}

function getKeepScrollPositionSetting(
  pageContext: PageConfigUserFriendly & PageContextRouted & Record<string, unknown>
): false | string | string[] {
  const c = pageContext.from.configsStandard.keepScrollPosition
  if (!c) return false
  let val = c.value
  const configDefinedAt = c.definedAt
  assert(configDefinedAt)
  const routeParameterList = getRouteStringParameterList(configDefinedAt)
  if (isCallable(val))
    val = val(pageContext, {
      configDefinedAt: c.definedAt
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
      })
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
