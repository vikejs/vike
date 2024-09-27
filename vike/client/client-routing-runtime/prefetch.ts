export { prefetch }
export { addLinkPrefetchHandlers }
export { getPrefetchedPageContext }

import {
  assert,
  assertClientRouting,
  assertUsage,
  assertUsageUrlPathname,
  assertWarning,
  checkIfClientRouting,
  getGlobalObject,
  hasProp,
  objectAssign
} from './utils.js'
import {
  type PageContextUserFiles,
  isErrorFetchingStaticAssets,
  loadUserFilesClientSide
} from '../shared/loadUserFilesClientSide.js'
import { skipLink } from './skipLink.js'
import { disableClientRouting } from './renderPageClientSide.js'
import { isClientSideRoutable } from './isClientSideRoutable.js'
import { createPageContext } from './createPageContext.js'
import { route, type PageContextFromRoute } from '../../shared/route/index.js'
import { noRouteMatch } from '../../shared/route/noRouteMatch.js'
import { type PageContextFromServerHooks, getPageContextFromServerHooks } from './getPageContextFromHooks.js'
import { PageFile } from '../../shared/getPageFiles.js'
import { type PageConfigRuntime } from '../../shared/page-configs/PageConfig.js'
import { getPageContextCurrent, getPageContextCurrentAsync } from './getPageContextCurrent.js'
import {
  PAGE_CONTEXT_MAX_AGE_DEFAULT,
  type PrefetchSettingResolved,
  getPrefetchSetting
} from './prefetch/getPrefetchSettings.js'
import pc from '@brillout/picocolors'

assertClientRouting()
const globalObject = getGlobalObject<{
  linkPrefetchHandlerAdded: WeakMap<HTMLElement, true>
  prefetchedPageContexts: Record<
    string, // URL
    PrefetchedPageContext
  >
}>('prefetch.ts', { linkPrefetchHandlerAdded: new WeakMap(), prefetchedPageContexts: {} })

type Result = Awaited<ReturnType<typeof getPageContextFromServerHooks>>
type PrefetchedPageContext = {
  resultFetchedAt: number
  resultMaxAge: number
  result: Result
}
type PageContextForPrefetch = {
  urlOriginal: string
  pageId: string
  _urlRewrite: null
  _pageFilesAll: PageFile[]
  _pageConfigs: PageConfigRuntime[]
}

function getPrefetchedPageContext(pageContext: {
  urlOriginal: string
}): null | PageContextFromServerHooks {
  const url = pageContext.urlOriginal
  const found = globalObject.prefetchedPageContexts[url]
  if (!found || found.result.is404ServerSideRouted || isExpired(found)) return null
  const prefetchedPageContextFromServerHooks = found.result.pageContextFromServerHooks
  // We discard the prefetched pageContext whenever we use it, so that the user always sees fresh data upon naivgating.
  delete globalObject.prefetchedPageContexts[url]
  return prefetchedPageContextFromServerHooks
}

async function prefetchAssets(pageContextLink: { pageId: string } & PageContextUserFiles): Promise<void> {
  try {
    await loadUserFilesClientSide(pageContextLink.pageId, pageContextLink._pageFilesAll, pageContextLink._pageConfigs)
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
  resultMaxAge: number
): Promise<void> {
  const result = await getPageContextFromServerHooks(pageContextLink, false)
  const urlOfLink = pageContextLink.urlOriginal
  globalObject.prefetchedPageContexts[urlOfLink] = {
    resultFetchedAt: Date.now(),
    resultMaxAge,
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
  const errPrefix = '[prefetch(url)] url' as const
  assertUsageUrlPathname(url, errPrefix)

  const pageContextLink = await getPageContextLink(url)
  if (!pageContextLink?.pageId) {
    assertWarning(false, `${errPrefix} ${pc.string(url)} ${noRouteMatch}`, {
      showStackTrace: true,
      onlyOnce: false
    })
    return
  }
  assert(hasProp(pageContextLink, 'pageId', 'string')) // help TypeScript

  await Promise.all([
    (async () => {
      if (options?.staticAssets !== false) {
        await prefetchAssets(pageContextLink)
      }
    })(),
    (async () => {
      if (options?.pageContext !== false) {
        const resultMaxAge = await getResultMaxAge()
        await prefetchPageContextFromServerHooks(pageContextLink, resultMaxAge)
      }
    })()
  ])

  return

  async function getResultMaxAge(): Promise<number> {
    if (typeof options?.pageContext === 'number') {
      return options.pageContext
    } else {
      // If user calls prefetch() before hydration finished => await the pageContext to be set
      const pageContext = await getPageContextCurrentAsync()
      const prefetchSettings = getPrefetchSetting(pageContext, null)
      const resultMaxAge =
        typeof prefetchSettings.pageContext === 'number' ? prefetchSettings.pageContext : PAGE_CONTEXT_MAX_AGE_DEFAULT
      return resultMaxAge
    }
  }
}

function addLinkPrefetchHandlers() {
  const pageContext = getPageContextCurrent()
  assert(pageContext)

  const linkTags = [...document.getElementsByTagName('A')] as HTMLElement[]
  linkTags.forEach(async (linkTag) => {
    if (globalObject.linkPrefetchHandlerAdded.has(linkTag)) return
    globalObject.linkPrefetchHandlerAdded.set(linkTag, true)
    if (skipLink(linkTag)) return

    const urlOfLink = linkTag.getAttribute('href')
    assert(urlOfLink)

    const prefetchSettings = getPrefetchSetting(pageContext, linkTag)

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
  prefetchSettings: PrefetchSettingResolved,
  event: 'hover' | 'viewport'
): Promise<void> {
  const pageContextLink = await getPageContextLink(urlOfLink)
  if (!pageContextLink?.pageId) return
  assert(hasProp(pageContextLink, 'pageId', 'string')) // help TypeScript
  if (!(await isClientSideRoutable(pageContextLink.pageId, pageContextLink))) return

  await Promise.all([
    (async () => {
      if (prefetchSettings.staticAssets === event) {
        await prefetchAssets(pageContextLink)
      }
    })(),
    (async () => {
      if (event !== 'viewport' && prefetchSettings.pageContext) {
        const found = globalObject.prefetchedPageContexts[urlOfLink]
        if (!found || isExpired(found)) {
          // TODO: move this logic in getPrefetchSettings()
          const resultMaxAge = prefetchSettings.pageContext
          await prefetchPageContextFromServerHooks(pageContextLink, resultMaxAge)
        }
      }
    })()
  ])
}

function isExpired(found: PrefetchedPageContext) {
  return Date.now() - found.resultFetchedAt > found.resultMaxAge
}

// We will be able to make this sync after we remove deprecated APIs.
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
