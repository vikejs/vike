export { prefetch }
export { addLinkPrefetchHandlers }
export { getPrefetchedPageContext }
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
import { getPageContextFromServerHooks } from './getPageContextFromHooks.js'
import { PageFile } from '../../shared/getPageFiles.js'
import { type PageConfigGlobalRuntime, type PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'
import { type Hook } from '../../shared/hooks/getHook.js'
import { type PageContextUrlClient } from '../../shared/getPageContextUrlComputed.js'

type BasicPageContext = {
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

type PrefetchedPageContext =
  | {
      is404ServerSideRouted: boolean
      pageContextFromHooks?: undefined
    }
  | {
      pageContextFromHooks: {
        isHydration: false
        _hasPageContextFromServer: boolean
      } & Partial<Record<string, unknown> & Record<'_pageId', string>>
      is404ServerSideRouted?: undefined
    }
  | undefined

assertClientRouting()
const globalObject = getGlobalObject<{
  linkPrefetchHandlerAdded: WeakMap<HTMLElement, true>
  prefetchedPageContexts: { pageId: string; prefetchedPageContext: PrefetchedPageContext }[]
  lastPrefetchTime: Map<string, number>
  expire?: number
}>('prefetch.ts', { linkPrefetchHandlerAdded: new WeakMap(), prefetchedPageContexts: [], lastPrefetchTime: new Map() })

function getPrefetchedPageContext() {
  return {
    prefetchedPageContexts: globalObject.prefetchedPageContexts,
    lastPrefetchTime: globalObject.lastPrefetchTime,
    expire: globalObject.expire
  }
}

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

async function prefetchPageContext(pageId: string, pageContext: BasicPageContext): Promise<void> {
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
    const res = await getPageContextFromServerHooks(pageContext, false)
    const pageContextWithDuplicateKey = globalObject.prefetchedPageContexts.find((pc) => pc.pageId === pageId)
    if (!pageContextWithDuplicateKey) {
      globalObject.prefetchedPageContexts.push({ pageId, prefetchedPageContext: res })
    }
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

function addLinkPrefetchHandlers(pageContextBeforeRenderClient: {
  exports: Record<string, unknown>
  urlPathname: string
}) {
  // Current URL is already prefetched
  markAsAlreadyPrefetched(pageContextBeforeRenderClient.urlPathname)

  const linkTags = [...document.getElementsByTagName('A')] as HTMLElement[]
  linkTags.forEach(async (linkTag) => {
    if (globalObject.linkPrefetchHandlerAdded.has(linkTag)) return
    globalObject.linkPrefetchHandlerAdded.set(linkTag, true)

    const url = linkTag.getAttribute('href')

    if (skipLink(linkTag)) return
    assert(url)

    if (isAlreadyPrefetched(url)) return

    const { prefetchStaticAssets, prefetchPageContext } = getPrefetchSettings(pageContextBeforeRenderClient, linkTag)
    if (!prefetchStaticAssets && !prefetchPageContext) return

    const pageContext = await createPageContext(url)
    let pageContextFromRoute: PageContextFromRoute
    try {
      pageContextFromRoute = await route(pageContext)
    } catch {
      // If a route() hook has a bug or `throw render()` / `throw redirect()`
      return
    }

    if (prefetchStaticAssets === 'hover') {
      linkTag.addEventListener('mouseover', () => {
        prefetchAssetsIfPossible(pageContextFromRoute._pageId, pageContext)
      })
      linkTag.addEventListener(
        'touchstart',
        () => {
          prefetchAssetsIfPossible(pageContextFromRoute._pageId, pageContext)
        },
        { passive: true }
      )
    }

    if (prefetchStaticAssets === 'viewport') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchAssetsIfPossible(pageContextFromRoute._pageId, pageContext)
            observer.disconnect()
          }
        })
      })
      observer.observe(linkTag)
    }

    if (typeof prefetchPageContext === 'number') {
      globalObject.expire = prefetchPageContext
      linkTag.addEventListener('mouseover', () => {
        prefetchContextIfPossible(prefetchPageContext, pageContextFromRoute._pageId, pageContext)
      })
      linkTag.addEventListener(
        'touchstart',
        () => {
          prefetchContextIfPossible(prefetchPageContext, pageContextFromRoute._pageId, pageContext)
        },
        { passive: true }
      )
    }
  })
}

async function prefetchAssetsIfPossible(pageId: string | null, pageContext: BasicPageContext): Promise<void> {
  if (!pageId) return
  if (!(await isClientSideRoutable(pageId, pageContext))) return
  await prefetchAssets(pageId, pageContext)
}

async function prefetchContextIfPossible(
  expire: number | undefined,
  pageId: string | null,
  pageContext: BasicPageContext
): Promise<void> {
  if (!pageId) return
  if (!(await isClientSideRoutable(pageId, pageContext))) return
  const now = Date.now()
  const lastPrefetch = globalObject?.lastPrefetchTime?.get(pageContext.urlOriginal)
  console.log('globalobject', globalObject.lastPrefetchTime)
  console.log('lastprefetch', lastPrefetch)
  if (lastPrefetch && expire && now - lastPrefetch < expire) {
    return
  }
  await prefetchPageContext(pageId, pageContext)
  globalObject.lastPrefetchTime?.set(pageContext.urlOriginal, now)
}
