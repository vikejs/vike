export { prefetch }
export { addLinkPrefetchHandlers }
export { getPrefetchedPageContextFromServerHooks }
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
import { route, type PageContextFromRoute } from '../../shared/route/index.js'
import { noRouteMatch } from '../../shared/route/noRouteMatch.js'
import { getPageContextFromServerHooks } from './getPageContextFromHooks.js'
import { PageFile } from '../../shared/getPageFiles.js'
import { type PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'
assertClientRouting()
const globalObject = getGlobalObject<{
  linkPrefetchHandlerAdded: WeakMap<HTMLElement, true>
  prefetchedPageContexts: { url: string; prefetchedPageContext: PrefetchedPageContext }[]
  expire?: number
  lastPrefetchTime: Map<string, number>
}>('prefetch.ts', { linkPrefetchHandlerAdded: new WeakMap(), prefetchedPageContexts: [], lastPrefetchTime: new Map() })

type PrefetchedPageContext =
  | { pageContextFromHooks: undefined; is404ServerSideRouted: true }
  | { pageContextFromHooks: { _hasPageContextFromServer: boolean } }

type PageContextForPrefetch = {
  urlOriginal: string
  _urlRewrite: null
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfigRuntime[]
}

function getPrefetchedPageContextFromServerHooks() {
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

async function prefetchPageContext(pageId: string, pageContext: PageContextForPrefetch): Promise<void> {
  try {
    objectAssign(pageContext, { _pageId: pageId })
    const res = await getPageContextFromServerHooks(pageContext, false)
    const matchedPageContext = globalObject.prefetchedPageContexts.find((pc) => pc.url === pageContext.urlOriginal)
    if (matchedPageContext) {
      matchedPageContext.prefetchedPageContext = res
    } else {
      globalObject.prefetchedPageContexts.push({ url: pageContext.urlOriginal, prefetchedPageContext: res })
    }
    globalObject.lastPrefetchTime?.set(pageContext.urlOriginal, Date.now())
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

    if (prefetchStaticAssets === 'hover') {
      linkTag.addEventListener('mouseover', () => {
        prefetchAssetsAndPageContextIfPossible(pageContext, prefetchPageContext)
      })
      linkTag.addEventListener(
        'touchstart',
        () => {
          prefetchAssetsAndPageContextIfPossible(pageContext, prefetchPageContext)
        },
        { passive: true }
      )
    }

    if (prefetchStaticAssets === 'viewport') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchAssetsAndPageContextIfPossible(pageContext)
            observer.disconnect()
          }
        })
      })
      observer.observe(linkTag)
    }
  })
}

async function prefetchAssetsAndPageContextIfPossible(
  pageContext: Awaited<ReturnType<typeof createPageContext>>,
  expire?: number | boolean
): Promise<void> {
  let pageContextFromRoute: PageContextFromRoute
  try {
    pageContextFromRoute = await route(pageContext)
  } catch {
    // If a route() hook has a bug or `throw render()` / `throw redirect()`
    return
  }

  if (!pageContextFromRoute._pageId) return
  if (!(await isClientSideRoutable(pageContextFromRoute._pageId, pageContext))) return
  await prefetchAssets(pageContextFromRoute._pageId, pageContext)

  if (typeof expire !== 'number') return
  globalObject.expire = expire

  const lastPrefetch = globalObject?.lastPrefetchTime?.get(pageContext.urlOriginal)
  if (lastPrefetch && expire && Date.now() - lastPrefetch < expire) {
    return
  }
  await prefetchPageContext(pageContextFromRoute._pageId, pageContext)
}
