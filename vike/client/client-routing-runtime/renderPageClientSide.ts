export { renderPageClientSide }
export { getRenderCount }
export { disableClientRouting }

import {
  assert,
  getCurrentUrl,
  isSameErrorMessage,
  objectAssign,
  redirectHard,
  getGlobalObject,
  executeHook,
  hasProp,
  augmentType
} from './utils.js'
import {
  getPageContextFromHooks_isHydration,
  getPageContextFromHooks_isNotHydration,
  getPageContextFromHooks_serialized
} from './getPageContextFromHooks.js'
import { createPageContext } from './createPageContext.js'
import { addLinkPrefetchHandlers } from './prefetch.js'
import { assertInfo, assertWarning, isReact } from './utils.js'
import { type PageContextBeforeRenderClient, executeOnRenderClientHook } from '../shared/executeOnRenderClientHook.js'
import { assertHook, getHook } from '../../shared/hooks/getHook.js'
import { isErrorFetchingStaticAssets, loadUserFilesClientSide } from '../shared/loadUserFilesClientSide.js'
import { pushHistory } from './history.js'
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
import { updateState } from './onBrowserHistoryNavigation.js'
import { browserNativeScrollRestoration_disable, setInitialRenderIsDone } from './scrollRestoration.js'
import { getErrorPageId } from '../../shared/error-page.js'
import type { PageContextExports } from '../../shared/getPageFiles.js'

const globalObject = getGlobalObject<{
  clientRoutingIsDisabled?: true
  renderCounter: number
  onRenderClientPromise?: Promise<unknown>
  isFirstRenderDone?: true
  isTransitioning?: true
  previousPageContext?: PreviousPageContext
}>('renderPageClientSide.ts', { renderCounter: 0 })
type PreviousPageContext = { _pageId: string } & PageContextExports

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
    urlOriginal = getCurrentUrl(),
    overwriteLastHistoryEntry = false,
    isBackwardNavigation,
    pageContextsFromRewrite = [],
    redirectCount = 0,
    isUserLandPushStateNavigation,
    isClientSideNavigation = true
  } = renderArgs
  let { scrollTarget } = renderArgs

  const { previousPageContext } = globalObject

  const { isRenderOutdated, setHydrationCanBeAborted, isFirstRender } = getIsRenderOutdated()
  // Note that pageContext.isHydration isn't equivalent to isFirstRender
  // - Thus pageContext.isHydration isn't equivalent to !pageContext.isClientSideNavigation
  // - `pageContext.isHydration === !isFirstRender && !isErrorPage`
  assert(isClientSideNavigation === !isFirstRender)
  assertNoInfiniteAbortLoop(pageContextsFromRewrite.length, redirectCount)

  if (globalObject.clientRoutingIsDisabled) {
    redirectHard(urlOriginal)
    return
  }

  await renderPageNominal()

  return

  async function renderPageNominal() {
    const onError = async (err: unknown) => {
      await renderErrorPage({ err })
    }

    const pageContext = await getPageContextBegin()
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
    let pageContextRouted: { _pageId: string; routeParams: Record<string, string> }
    if (isFirstRender) {
      const pageContextSerialized = getPageContextFromHooks_serialized()
      pageContextRouted = pageContextSerialized
    } else {
      let pageContextFromRoute: Awaited<ReturnType<typeof route>>
      try {
        pageContextFromRoute = await route(pageContext)
      } catch (err) {
        await onError(err)
        return
      }
      if (isRenderOutdated()) return
      let isClientRoutable: boolean
      if (!pageContextFromRoute._pageId) {
        isClientRoutable = false
      } else {
        isClientRoutable = await isClientSideRoutable(pageContextFromRoute._pageId, pageContext)
        if (isRenderOutdated()) return
      }
      if (!isClientRoutable) {
        redirectHard(urlOriginal)
        return
      }
      assert(hasProp(pageContextFromRoute, '_pageId', 'string')) // Help TS
      const isSamePage =
        pageContextFromRoute._pageId &&
        previousPageContext?._pageId &&
        pageContextFromRoute._pageId === previousPageContext._pageId
      if (isUserLandPushStateNavigation && isSamePage) {
        // Skip's Vike's rendering; let the user handle the navigation
        return
      }
      pageContextRouted = pageContextFromRoute
    }
    assert(!('urlOriginal' in pageContextRouted))
    objectAssign(pageContext, pageContextRouted)

    try {
      objectAssign(
        pageContext,
        await loadUserFilesClientSide(pageContext._pageId, pageContext._pageFilesAll, pageContext._pageConfigs)
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
      let res: Awaited<ReturnType<typeof getPageContextFromHooks_isNotHydration>>
      try {
        res = await getPageContextFromHooks_isNotHydration(pageContext, false)
      } catch (err) {
        await onError(err)
        return
      }
      if (isRenderOutdated()) return
      if ('is404ServerSideRouted' in res) return
      augmentType(pageContext, res.pageContextAugmented)

      // Render page view
      await renderPageView(pageContext)
    }
  }

  async function getPageContextBegin() {
    const pageContext = await createPageContext(urlOriginal)
    objectAssign(pageContext, {
      isBackwardNavigation,
      isClientSideNavigation,
      _previousPageContext: previousPageContext
    })
    {
      const pageContextFromAllRewrites = getPageContextFromAllRewrites(pageContextsFromRewrite)
      assert(!('urlOriginal' in pageContextFromAllRewrites))
      objectAssign(pageContext, pageContextFromAllRewrites)
    }
    return pageContext
  }

  async function renderErrorPage(args: { err?: unknown; pageContextError?: Record<string, unknown> }) {
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

    const pageContext = await getPageContextBegin()
    if (isRenderOutdated()) return

    if (args.pageContextError) {
      objectAssign(pageContext, args.pageContextError)
    }

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
      _pageId: errorPageId
    })

    try {
      objectAssign(
        pageContext,
        await loadUserFilesClientSide(pageContext._pageId, pageContext._pageFilesAll, pageContext._pageConfigs)
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

    let res: Awaited<ReturnType<typeof getPageContextFromHooks_isNotHydration>>
    try {
      res = await getPageContextFromHooks_isNotHydration(pageContext, true)
    } catch (err: unknown) {
      // - When user hasn't defined a `_error.page.js` file
      // - Some Vike unpexected internal error
      onError(err)
      return
    }
    if (isRenderOutdated()) return
    if ('is404ServerSideRouted' in res) return
    augmentType(pageContext, res.pageContextAugmented)

    await renderPageView(pageContext, args)
  }

  async function renderPageView(
    pageContext: PageContextBeforeRenderClient & { urlPathname: string },
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

    // We use globalObject.onRenderClientPromise in order to ensure that there is never two concurrent onRenderClient() calls
    if (globalObject.onRenderClientPromise) {
      // Make sure that the previous render has finished
      await globalObject.onRenderClientPromise
      assert(globalObject.onRenderClientPromise === undefined)
      if (isRenderOutdated()) return
    }
    changeUrl(urlOriginal, overwriteLastHistoryEntry)
    globalObject.previousPageContext = pageContext
    assert(globalObject.onRenderClientPromise === undefined)
    globalObject.onRenderClientPromise = (async () => {
      let onRenderClientError: unknown
      try {
        await executeOnRenderClientHook(pageContext, true)
      } catch (err) {
        onRenderClientError = err
      }
      globalObject.onRenderClientPromise = undefined
      globalObject.isFirstRenderDone = true
      return onRenderClientError
    })()
    const onRenderClientError = await globalObject.onRenderClientPromise
    assert(globalObject.onRenderClientPromise === undefined)
    if (onRenderClientError) {
      await onError(onRenderClientError)
      if (!isErrorPage) return
    }
    /* We don't abort in order to ensure that onHydrationEnd() is called: we abort only after onHydrationEnd() is called.
    if (isRenderOutdated(true)) return
    */

    addLinkPrefetchHandlers(pageContext)

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
      if (keepScrollPositionNext !== false && keepScrollPositionNext === keepScrollPositionPrev) {
        scrollTarget = { preserveScroll: true }
      }
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

function getKeepScrollPositionSetting(pageContext: PageContextExports & Record<string, unknown>): false | string {
  const c = pageContext.from.configsStandard.keepScrollPosition
  if (!c) return false
  const val = c.value
  if (val === true) {
    const group = c.definedAt
    assert(group)
    return group
  }
  // We skip validation and type-cast instead of assertUsage() in order to save client-side KBs
  return val as any
}
