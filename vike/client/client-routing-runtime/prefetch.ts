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
  hasProp,
  isExternalLink,
  objectAssign
} from './utils.js'
import {
  type PageContextUserFiles,
  isErrorFetchingStaticAssets,
  loadUserFilesClientSide
} from '../shared/loadUserFilesClientSide.js'
import { skipLink } from './skipLink.js'
import { type PrefetchSettings, getPrefetchSettings } from './prefetch/getPrefetchSettings.js'
import { disableClientRouting } from './renderPageClientSide.js'
import { isClientSideRoutable } from './isClientSideRoutable.js'
import { createPageContext } from './createPageContext.js'
import { route, type PageContextFromRoute } from '../../shared/route/index.js'
import { noRouteMatch } from '../../shared/route/noRouteMatch.js'
import { type PageContextFromServerHooks, getPageContextFromServerHooks } from './getPageContextFromHooks.js'
import { PageFile } from '../../shared/getPageFiles.js'
import { type PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'
import { getCurrentPageContext, getCurrentPageContextAwait } from './getCurrentPageContext.js'
assertClientRouting()
const globalObject = getGlobalObject<{
  linkPrefetchHandlerAdded: WeakMap<HTMLElement, true>
  prefetchedPageContexts: Record<
    string, // URL
    PrefetchedPageContext
  >
}>('prefetch.ts', { linkPrefetchHandlerAdded: new WeakMap(), prefetchedPageContexts: {} })
const PAGE_CONTEXT_EXPIRE_DEFAULT = 5000

type Result = Awaited<ReturnType<typeof getPageContextFromServerHooks>>
type PrefetchedPageContext = {
  resultFetchedAt: number
  resultExpire: number
  result: Result
}
type PageContextForPrefetch = {
  urlOriginal: string
  _pageId: string
  _urlRewrite: null
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfigRuntime[]
}

function getPrefetchedPageContextFromServerHooks(pageContext: {
  urlOriginal: string
}): null | PageContextFromServerHooks {
  const url = pageContext.urlOriginal
  const found = globalObject.prefetchedPageContexts[url]
  if (!found || found.result.is404ServerSideRouted || isExpired(found)) return null
  const prefetchedPageContextFromServerHooks = found.result.pageContextFromHooks
  // We discard the prefetched pageContext whenever we use it, so that when the user clicks on a link he always gets a fresh pageContext.
  delete globalObject.prefetchedPageContexts[url]
  return prefetchedPageContextFromServerHooks
}

async function prefetchAssets(pageContextLink: { _pageId: string } & PageContextUserFiles): Promise<void> {
  try {
    await loadUserFilesClientSide(pageContextLink._pageId, pageContextLink._pageFilesAll, pageContextLink._pageConfigs)
  } catch (err) {
    if (isErrorFetchingStaticAssets(err)) {
      disableClientRouting(err, true)
    } else {
      throw err
    }
  }
}

async function prefetchPageContextFromServerHooks(
  pageContextLink: PageContextForPrefetch,
  resultExpire: number
): Promise<void> {
  let result: Result
  try {
    result = await getPageContextFromServerHooks(pageContextLink, false)
  } catch {
    return
  }
  const urlOfLink = pageContextLink.urlOriginal
  globalObject.prefetchedPageContexts[urlOfLink] = {
    resultFetchedAt: Date.now(),
    resultExpire,
    result
  }
}

/**
 * Programmatically prefetch client assets.
 *
 * https://vike.dev/prefetch
 *
 * @param url - The URL of the page you want to prefetch.
 */
async function prefetch(url: string, options?: { pageContext?: boolean; staticAssets?: boolean }): Promise<void> {
  assertUsage(checkIfClientRouting(), 'prefetch() only works with Client Routing, see https://vike.dev/prefetch', {
    showStackTrace: true
  })
  const errPrefix = `Cannot prefetch URL ${url} because it` as const
  assertUsage(!isExternalLink(url), `${errPrefix} lives on another domain`, { showStackTrace: true })

  const pageContextLink = await getPageContextLink(url)
  if (!pageContextLink?._pageId) {
    assertWarning(false, `${errPrefix} ${noRouteMatch}`, {
      showStackTrace: true,
      onlyOnce: false
    })
    return
  }
  assert(hasProp(pageContextLink, '_pageId', 'string')) // help TypeScript

  if (options?.staticAssets !== false) {
    await prefetchAssets(pageContextLink)
  }
  if (options?.pageContext !== false) {
    const resultExpire = await getResultExpire()
    await prefetchPageContextFromServerHooks(pageContextLink, resultExpire)
  }

  return

  async function getResultExpire(): Promise<number> {
    if (typeof options?.pageContext === 'number') {
      return options.pageContext
    } else {
      // If user calls prefetch() before hydration finished => await the pageContext to be set
      const pageContext = await getCurrentPageContextAwait()
      const prefetchSettings = getPrefetchSettings(pageContext, null)
      // TODO: move this logic in getPrefetchSettings()
      const resultExpire =
        typeof prefetchSettings.prefetchPageContext === 'number'
          ? prefetchSettings.prefetchPageContext
          : PAGE_CONTEXT_EXPIRE_DEFAULT
      return resultExpire
    }
  }
}

function addLinkPrefetchHandlers() {
  const pageContext = getCurrentPageContext()
  assert(pageContext)

  const linkTags = [...document.getElementsByTagName('A')] as HTMLElement[]
  linkTags.forEach(async (linkTag) => {
    if (globalObject.linkPrefetchHandlerAdded.has(linkTag)) return
    globalObject.linkPrefetchHandlerAdded.set(linkTag, true)
    if (skipLink(linkTag)) return

    const urlOfLink = linkTag.getAttribute('href')
    assert(urlOfLink)

    const prefetchSettings = getPrefetchSettings(pageContext, linkTag)
    if (!prefetchSettings.prefetchStaticAssets && !prefetchSettings.prefetchPageContext) return

    linkTag.addEventListener('mouseover', () => {
      prefetchOnEvent(urlOfLink, prefetchSettings, 'hover')
    })
    linkTag.addEventListener(
      'touchstart',
      () => {
        prefetchOnEvent(urlOfLink, prefetchSettings, 'hover')
      },
      { passive: true }
    )

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          prefetchOnEvent(urlOfLink, prefetchSettings, 'viewport')
          observer.disconnect()
        }
      })
    })
    observer.observe(linkTag)
  })
}

async function prefetchOnEvent(
  urlOfLink: string,
  prefetchSettings: PrefetchSettings,
  event: 'hover' | 'viewport'
): Promise<void> {
  const pageContextLink = await getPageContextLink(urlOfLink)
  if (!pageContextLink?._pageId) return
  assert(hasProp(pageContextLink, '_pageId', 'string')) // help TypeScript
  if (!(await isClientSideRoutable(pageContextLink._pageId, pageContextLink))) return

  if (prefetchSettings.prefetchStaticAssets === event) {
    await prefetchAssets(pageContextLink)
  }

  if (event !== 'viewport' && prefetchSettings.prefetchPageContext) {
    const found = globalObject.prefetchedPageContexts[urlOfLink]
    if (!found || isExpired(found)) {
      // TODO: move this logic in getPrefetchSettings()
      const resultExpire =
        typeof prefetchSettings.prefetchPageContext === 'number'
          ? prefetchSettings.prefetchPageContext
          : PAGE_CONTEXT_EXPIRE_DEFAULT
      await prefetchPageContextFromServerHooks(pageContextLink, resultExpire)
    }
  }
}

function isExpired(found: PrefetchedPageContext) {
  return Date.now() - found.resultFetchedAt > found.resultExpire
}

async function getPageContextLink(urlOfLink: string) {
  const pageContextLink = await createPageContext(urlOfLink)

  let pageContextFromRoute: PageContextFromRoute
  try {
    pageContextFromRoute = await route(pageContextLink)
  } catch {
    // If a route() hook has a bug or `throw render()` / `throw redirect()`
    return null
  }
  objectAssign(pageContextLink, pageContextFromRoute)

  return pageContextLink
}
