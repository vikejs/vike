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
import { getCurrentPageContext } from './getCurrentPageContext.js'
assertClientRouting()
const globalObject = getGlobalObject<{
  linkPrefetchHandlerAdded: WeakMap<HTMLElement, true>
  prefetchedPageContexts: PrefetchedPageContext[]
}>('prefetch.ts', { linkPrefetchHandlerAdded: new WeakMap(), prefetchedPageContexts: [] })
const PAGE_CONTEXT_EXPIRE_DEFAULT = 5000

type Result = Awaited<ReturnType<typeof getPageContextFromServerHooks>>
type PrefetchedPageContext = {
  urlOfLink: string
  resultFetchedAt: number
  resultExpire: number
  result: Result
}
type PageContextForPrefetch = {
  urlOriginal: string
  _urlRewrite: null
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfigRuntime[]
}

function getPrefetchedPageContextFromServerHooks(pageContext: {
  urlOriginal: string
}): null | PageContextFromServerHooks {
  const found = globalObject.prefetchedPageContexts.find((pc) => pc.urlOfLink === pageContext.urlOriginal)
  if (!found || found.result.is404ServerSideRouted || isExpired(found)) return null
  return found.result.pageContextFromHooks
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

async function prefetchPageContextFromServerHooks(
  pageId: string,
  pageContextLink: PageContextForPrefetch,
  prefetchSettings: PrefetchSettings
): Promise<void> {
  objectAssign(pageContextLink, { _pageId: pageId })
  let result: Result
  try {
    result = await getPageContextFromServerHooks(pageContextLink, false)
  } catch {
    return
  }
  const entry: PrefetchedPageContext = {
    urlOfLink: pageContextLink.urlOriginal,
    resultFetchedAt: Date.now(),
    resultExpire:
      typeof prefetchSettings.prefetchPageContext === 'number'
        ? prefetchSettings.prefetchPageContext
        : PAGE_CONTEXT_EXPIRE_DEFAULT,
    result
  }
  const found = globalObject.prefetchedPageContexts.find((pc) => pc.urlOfLink === pageContextLink.urlOriginal)
  if (found) {
    objectAssign(found, entry)
  } else {
    globalObject.prefetchedPageContexts.push(entry)
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

  const pageContextLink = await createPageContext(url)
  let pageContextFromRoute: PageContextFromRoute
  try {
    pageContextFromRoute = await route(pageContextLink)
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

  if (options?.staticAssets !== false) {
    await prefetchAssets(pageId, pageContextLink)
  }
  if (options?.pageContext !== false) {
    const pageContext = getCurrentPageContext()
    assert(pageContext)
    const prefetchSettings = getPrefetchSettings(pageContext)
    // TODO: allow options.pageContext to be a number
    await prefetchPageContextFromServerHooks(pageId, pageContextLink, prefetchSettings)
  }
}

function addLinkPrefetchHandlers() {
  const pageContext = getCurrentPageContext()
  assert(pageContext)

  const linkTags = [...document.getElementsByTagName('A')] as HTMLElement[]
  linkTags.forEach(async (linkTag) => {
    if (globalObject.linkPrefetchHandlerAdded.has(linkTag)) return
    globalObject.linkPrefetchHandlerAdded.set(linkTag, true)

    const urlOfLink = linkTag.getAttribute('href')

    if (skipLink(linkTag)) return
    assert(urlOfLink)

    const prefetchSettings = getPrefetchSettings(pageContext, linkTag)
    if (!prefetchSettings.prefetchStaticAssets && !prefetchSettings.prefetchPageContext) return

    if (prefetchSettings.prefetchStaticAssets === 'hover') {
      linkTag.addEventListener('mouseover', () => {
        prefetchIfEnabled(urlOfLink, prefetchSettings)
      })
      linkTag.addEventListener(
        'touchstart',
        () => {
          prefetchIfEnabled(urlOfLink, prefetchSettings)
        },
        { passive: true }
      )
    }

    if (prefetchSettings.prefetchStaticAssets === 'viewport') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchIfEnabled(urlOfLink, prefetchSettings, true)
            observer.disconnect()
          }
        })
      })
      observer.observe(linkTag)
    }
  })
}

async function prefetchIfEnabled(
  urlOfLink: string,
  prefetchSettings: PrefetchSettings,
  skipPageContext?: true
): Promise<void> {
  const pageContextLink = await createPageContext(urlOfLink)

  let pageContextFromRoute: PageContextFromRoute
  try {
    pageContextFromRoute = await route(pageContextLink)
  } catch {
    // If a route() hook has a bug or `throw render()` / `throw redirect()`
    return
  }
  if (!pageContextFromRoute._pageId) return
  if (!(await isClientSideRoutable(pageContextFromRoute._pageId, pageContextLink))) return

  await prefetchAssets(pageContextFromRoute._pageId, pageContextLink)

  if (!skipPageContext && prefetchSettings.prefetchPageContext) {
    const found = globalObject.prefetchedPageContexts.find((pc) => pc.urlOfLink === urlOfLink)
    if (!found || isExpired(found)) {
      await prefetchPageContextFromServerHooks(pageContextFromRoute._pageId, pageContextLink, prefetchSettings)
    }
  }
}

function isExpired(found: PrefetchedPageContext) {
  return Date.now() - found.resultFetchedAt > found.resultExpire
}
