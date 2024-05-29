export { prefetch }
export { addLinkPrefetchHandlers }
export { getPrefetchedPageContextFromServerHooks }

import {
  assert,
  assertClientRouting,
  assertUsage,
  assertWarning,
  checkIfClientRouting,
  getGlobalObject,
  isExternalLink,
  objectAssign,
  parseUrl
} from './utils.js'
import {
  type PageContextUserFiles,
  isErrorFetchingStaticAssets,
  loadUserFilesClientSide
} from '../shared/loadUserFilesClientSide.js'
import { skipLink } from './skipLink.js'
import { getPrefetchSettings } from './prefetch/getPrefetchSettings.js'
import { disableClientRouting } from './renderPageClientSide.js'
import { isClientSideRoutable } from './isClientSideRoutable.js'
import { createPageContext } from './createPageContext.js'
import { route, type PageContextFromRoute } from '../../shared/route/index.js'
import { noRouteMatch } from '../../shared/route/noRouteMatch.js'
import { type PageContextFromServerHooks, getPageContextFromServerHooks } from './getPageContextFromHooks.js'
import { PageFile } from '../../shared/getPageFiles.js'
import { type PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'
assertClientRouting()
const globalObject = getGlobalObject<{
  linkPrefetchHandlerAdded: WeakMap<HTMLElement, true>
  prefetchedPageContexts: {
    urlOfPrefetchedLink: string
    result: Awaited<ReturnType<typeof getPageContextFromServerHooks>>
  }[]
  expire?: number
  lastPrefetchTime: Map<string, number>
}>('prefetch.ts', { linkPrefetchHandlerAdded: new WeakMap(), prefetchedPageContexts: [], lastPrefetchTime: new Map() })

type PageContextForPrefetch = {
  urlOriginal: string
  _urlRewrite: null
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfigRuntime[]
}
const linkAlreadyPrefetched = new Map<string, true>()

function getPrefetchedPageContextFromServerHooks(pageContext: {
  urlOriginal: string
}): null | PageContextFromServerHooks {
  const found = globalObject.prefetchedPageContexts.find((pc) => pc.urlOfPrefetchedLink === pageContext.urlOriginal)
  const lastPrefetch = globalObject.lastPrefetchTime.get(pageContext.urlOriginal)
  if (!found) return null
  if ('is404ServerSideRouted' in found.result) return null
  if (lastPrefetch && globalObject.expire && Date.now() - lastPrefetch < globalObject.expire) {
    return found.result.pageContextFromHooks
  }
  return null
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

async function prefetchPageContextFromServer(pageId: string, pageContext: PageContextForPrefetch): Promise<void> {
  try {
    objectAssign(pageContext, { _pageId: pageId })
    const result = await getPageContextFromServerHooks(pageContext, false)
    const found = globalObject.prefetchedPageContexts.find((pc) => pc.urlOfPrefetchedLink === pageContext.urlOriginal)
    if (found) {
      found.result = result
    } else {
      globalObject.prefetchedPageContexts.push({
        urlOfPrefetchedLink: pageContext.urlOriginal,
        result
      })
    }
    globalObject.lastPrefetchTime.set(pageContext.urlOriginal, Date.now())
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

  // TODO: rename to pageContextTmp
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
  await prefetchPageContextFromServer(pageId, pageContext)
}

function addLinkPrefetchHandlers(pageContextAfterOnRenderClient: {
  exports: Record<string, unknown>
  urlPathname: string
}) {
  // Current URL is already prefetched
  markAsAlreadyPrefetched(pageContextAfterOnRenderClient.urlPathname)

  const linkTags = [...document.getElementsByTagName('A')] as HTMLElement[]
  linkTags.forEach(async (linkTag) => {
    if (globalObject.linkPrefetchHandlerAdded.has(linkTag)) return
    globalObject.linkPrefetchHandlerAdded.set(linkTag, true)

    // TODO: rename to urlOfLink
    const url = linkTag.getAttribute('href')

    if (skipLink(linkTag)) return
    assert(url)

    if (isAlreadyPrefetched(url)) return

    const { prefetchStaticAssets, prefetchPageContext } = getPrefetchSettings(pageContextAfterOnRenderClient, linkTag)
    if (!prefetchStaticAssets && !prefetchPageContext) return

    if (prefetchStaticAssets === 'hover') {
      linkTag.addEventListener('mouseover', () => {
        prefetchIfPossible(url, prefetchPageContext)
      })
      linkTag.addEventListener(
        'touchstart',
        () => {
          prefetchIfPossible(url, prefetchPageContext)
        },
        { passive: true }
      )
    }

    if (prefetchStaticAssets === 'viewport') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchIfPossible(url)
            observer.disconnect()
          }
        })
      })
      observer.observe(linkTag)
    }
  })
}

async function prefetchIfPossible(url: string, prefetchPageContext?: number | boolean): Promise<void> {
  // TODO: rename to pageContextTmp
  const pageContext = await createPageContext(url)

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

  if (typeof prefetchPageContext !== 'number') return
  globalObject.expire = prefetchPageContext

  const lastPrefetch = globalObject.lastPrefetchTime.get(pageContext.urlOriginal)
  if (lastPrefetch && prefetchPageContext && Date.now() - lastPrefetch < prefetchPageContext) {
    return
  }
  await prefetchPageContextFromServer(pageContextFromRoute._pageId, pageContext)
}

function isAlreadyPrefetched(url: string): boolean {
  const urlPathname = getUrlPathname(url)
  return linkAlreadyPrefetched.has(urlPathname)
}
function markAsAlreadyPrefetched(url: string): void {
  const urlPathname = getUrlPathname(url)
  linkAlreadyPrefetched.set(urlPathname, true)
}

function getUrlPathname(url: string): string {
  const urlPathname = parseUrl(url, '/').pathname
  return urlPathname
}
