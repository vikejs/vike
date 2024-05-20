export { prefetch }
export { addLinkPrefetchHandlers }
export { type PrefetchedPageContext }

import {
  assert,
  assertClientRouting,
  assertUsage,
  assertWarning,
  checkIfClientRouting,
  getGlobalObject,
  isExternalLink,
  objectAssign
} from './utils.js'
import {
  type PageContextUserFiles,
  isErrorFetchingStaticAssets,
  loadUserFilesClientSide
} from '../shared/loadUserFilesClientSide.js'
import { skipLink } from './skipLink.js'
import { getPrefetchSettings } from './prefetch/getPrefetchSettings.js'
import { isAlreadyPrefetched, markAsAlreadyPrefetched } from './prefetch/alreadyPrefetched.js'
import { disableClientRouting } from './renderPageClientSide.js'
import { isClientSideRoutable } from './isClientSideRoutable.js'
import { createPageContext } from './createPageContext.js'
import { route, type PageContextFromRoute, PageRoutes } from '../../shared/route/index.js'
import { noRouteMatch } from '../../shared/route/noRouteMatch.js'
import { getPageContextFromHooks_isNotHydration } from './getPageContextFromHooks.js'
import { PageFile } from '../../shared/getPageFiles.js'
import { type PageConfigGlobalRuntime, type PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'
import { type Hook } from '../../shared/hooks/getHook.js'
import { type PageContextUrlClient } from '../../shared/getPageContextUrlComputed.js'

type PrefetchedPageContext =
  | {
      is404ServerSideRouted: boolean
      pageContextFromHooks?: {
        _pageId: string
        data: unknown
      }
    }
  | {
      pageContextFromHooks: {
        isHydration: false
        _hasPageContextFromClient: boolean
        _hasPageContextFromServer: boolean
      }
      is404ServerSideRouted?: undefined
    }
  | undefined

assertClientRouting()
const globalObject = getGlobalObject<{
  linkPrefetchHandlerAdded: WeakMap<HTMLElement, true>
  prefetchedPageContext?: PrefetchedPageContext
  lastPrefetchTime: Map<string, number>
}>('prefetch.ts', { linkPrefetchHandlerAdded: new WeakMap(), lastPrefetchTime: new Map() })

async function prefetchAssets(pageId: string, pageContext: PageContextUserFiles): Promise<void> {
  try {
    await loadUserFilesClientSide(pageId, pageContext._pageFilesAll, pageContext._pageConfigs)
  } catch (err) {
    if (isErrorFetchingStaticAssets(err)) {
      disableClientRouting(err, true)
    } else {
      throw err
    }
  }
}

async function prefetchPageContext(
  pageId: string,
  pageContext: {
    urlOriginal: string
    _objectCreatedByVike: boolean
    _urlHandler: null
    _urlRewrite: null
    _baseServer: string
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfigRuntime[]
    _pageConfigGlobal: PageConfigGlobalRuntime
    _allPageIds: string[]
    _pageRoutes: PageRoutes
    _onBeforeRouteHook: Hook | null
  } & PageContextUrlClient
): Promise<void> {
  try {
    objectAssign(
      pageContext,
      await loadUserFilesClientSide(pageId, pageContext._pageFilesAll, pageContext._pageConfigs)
    )
    objectAssign(pageContext, {
      isHydration: false as const,
      isBackwardNavigation: null,
      _hasPageContextFromServer: false as const,
      _hasPageContextFromClient: true as const,
      _pageId: pageId,
      _pageConfigs: pageContext._pageConfigs
    })
    const res = await getPageContextFromHooks_isNotHydration(pageContext, false)
    globalObject.prefetchedPageContext = res
  } catch {
    return
  }
}

/**
 * Programmatically prefetch client assets.
 *
 * https://vike.dev/prefetch
 *
 * @param url - The URL of the page you want to prefetch.
 */
async function prefetch(url: string): Promise<void> {
  assertUsage(checkIfClientRouting(), 'prefetch() only works with Client Routing, see https://vike.dev/prefetch', {
    showStackTrace: true
  })
  const errPrefix = `Cannot prefetch URL ${url} because it` as const
  assertUsage(!isExternalLink(url), `${errPrefix} lives on another domain`, { showStackTrace: true })

  if (isAlreadyPrefetched(url)) return
  markAsAlreadyPrefetched(url)

  const pageContext = await createPageContext(url)
  let pageContextFromRoute: PageContextFromRoute
  try {
    pageContextFromRoute = await route(pageContext)
  } catch {
    // If a route() hook has a bug or `throw render()` / `throw redirect()`
    return
  }
  const pageId = pageContextFromRoute._pageId

  if (!pageId) {
    assertWarning(false, `${errPrefix} ${noRouteMatch}`, {
      showStackTrace: true,
      onlyOnce: false
    })
    return
  }

  await prefetchAssets(pageId, pageContext)
  await prefetchPageContext(pageId, pageContext)
}

function addLinkPrefetchHandlers(pageContext: { exports: Record<string, unknown>; urlPathname: string }) {
  // Current URL is already prefetched
  markAsAlreadyPrefetched(pageContext.urlPathname)

  const linkTags = [...document.getElementsByTagName('A')] as HTMLElement[]
  linkTags.forEach((linkTag) => {
    if (globalObject.linkPrefetchHandlerAdded.has(linkTag)) return
    globalObject.linkPrefetchHandlerAdded.set(linkTag, true)

    const url = linkTag.getAttribute('href')

    if (skipLink(linkTag)) return
    assert(url)

    if (isAlreadyPrefetched(url)) return

    const { prefetchStaticAssets, prefetchPageContext } = getPrefetchSettings(pageContext, linkTag)
    if (!prefetchStaticAssets && !prefetchPageContext) return

    if (prefetchStaticAssets === 'hover') {
      linkTag.addEventListener('mouseover', () => {
        prefetchAssetsIfPossible(url)
      })
      linkTag.addEventListener(
        'touchstart',
        () => {
          prefetchAssetsIfPossible(url)
        },
        { passive: true }
      )
    }

    if (prefetchStaticAssets === 'viewport') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchAssetsIfPossible(url)
            observer.disconnect()
          }
        })
      })
      observer.observe(linkTag)
    }

    if (prefetchPageContext?.when === 'hover') {
      linkTag.addEventListener('mouseover', () => {
        prefetchContextIfPossible(url, prefetchPageContext?.expire)
      })
      linkTag.addEventListener(
        'touchstart',
        () => {
          prefetchContextIfPossible(url, prefetchPageContext?.expire)
        },
        { passive: true }
      )
    }
  })
}

async function prefetchAssetsIfPossible(url: string): Promise<void> {
  const pageContext = await createPageContext(url)
  let pageContextFromRoute: PageContextFromRoute
  try {
    pageContextFromRoute = await route(pageContext)
  } catch {
    // If a route() hook has a bug or `throw render()` / `throw redirect()`
    return
  }
  if (!pageContextFromRoute?._pageId) return
  if (!(await isClientSideRoutable(pageContextFromRoute._pageId, pageContext))) return
  await prefetchAssets(pageContextFromRoute._pageId, pageContext)
}

async function prefetchContextIfPossible(url: string, expire: number | undefined): Promise<void> {
  const now = Date.now()
  const lastPrefetch = globalObject?.lastPrefetchTime?.get(url)
  if (lastPrefetch && expire && now - lastPrefetch < expire) {
    return
  }
  const pageContext = await createPageContext(url)
  let pageContextFromRoute: PageContextFromRoute
  try {
    pageContextFromRoute = await route(pageContext)
  } catch {
    // If a route() hook has a bug or `throw render()` / `throw redirect()`
    return
  }
  if (!pageContextFromRoute?._pageId) return

  if (!(await isClientSideRoutable(pageContextFromRoute._pageId, pageContext))) return
  await prefetchPageContext(pageContextFromRoute._pageId, pageContext)
  globalObject.lastPrefetchTime?.set(url, now)
}
