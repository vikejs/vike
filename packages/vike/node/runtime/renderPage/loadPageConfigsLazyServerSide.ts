export { loadPageConfigsLazyServerSideAndExecHook }
export type { PageContext_loadPageConfigsLazyServerSide }
export type { PageConfigsLazy }

import { type VikeConfigPublicPageLazyLoaded, getPageFilesServerSide } from '../../../shared/getPageFiles.js'
import { resolveVikeConfigPublicPageLazyLoaded } from '../../../shared/page-configs/resolveVikeConfigPublic.js'
import { analyzePageClientSideInit } from '../../../shared/getPageFiles/analyzePageClientSide.js'
import { assertUsage, assertWarning, hasProp, isArray, isObject, objectAssign, PromiseType } from '../utils.js'
import { getPageAssets, type PageAsset } from './getPageAssets.js'
import type { PageConfigRuntime } from '../../../types/PageConfig.js'
import { findPageConfig } from '../../../shared/page-configs/findPageConfig.js'
import { analyzePage } from './analyzePage.js'
import type { MediaType } from './inferMediaType.js'
import { loadAndParseVirtualFilePageEntry } from '../../../shared/page-configs/loadAndParseVirtualFilePageEntry.js'
import { execHookServer } from './execHookServer.js'
import { getCacheControl } from './getCacheControl.js'
import type { PassToClient } from '../html/serializeContext.js'
import type { PageContextAfterRoute } from '../../../shared/route/index.js'
import type { PageContextCreated } from './createPageContextServerSide.js'

type PageContext_loadPageConfigsLazyServerSide = PageContextCreated &
  PageContextAfterRoute & { is404: boolean | null; pageId: string }
type PageConfigsLazy = PromiseType<ReturnType<typeof loadPageConfigsLazyServerSideAndExecHook>>

async function loadPageConfigsLazyServerSideAndExecHook(pageContext: PageContext_loadPageConfigsLazyServerSide) {
  objectAssign(pageContext, {
    _pageConfig: findPageConfig(pageContext._globalContext._pageConfigs, pageContext.pageId),
  })

  // Load the page's + files
  objectAssign(pageContext, await loadPageUserFiles(pageContext))

  // Resolve computed pageContext properties
  objectAssign(pageContext, await resolvePageContext(pageContext))

  return pageContext
}

type PageContextBeforeResolve = PageContext_loadPageConfigsLazyServerSide & {
  _pageConfig: null | PageConfigRuntime
} & VikeConfigPublicPageLazyLoaded
async function resolvePageContext(pageContext: PageContextBeforeResolve) {
  const { isHtmlOnly, clientEntries, clientDependencies } = analyzePage(pageContext)

  const passToClient: PassToClient = []
  const errMsgSuffix = ' should be an array of strings.'
  const isV1Design = !!pageContext._pageConfig
  if (!isV1Design) {
    pageContext.exportsAll.passToClient?.forEach((e) => {
      assertUsage(hasProp(e, 'exportValue', 'string[]'), `${e.exportSource}${errMsgSuffix}`)
      passToClient.push(...e.exportValue)
    })
  } else {
    pageContext.from.configsCumulative.passToClient?.values.forEach((v) => {
      const { value, definedAt } = v
      const errMsg = `+passToClient value defined at ${definedAt}${errMsgSuffix}` as const

      //*/ TO-DO/next-major-release: remove the passToClient once setting from the public API
      assertUsage(isArray(value), `+passToClient value defined at ${definedAt} should be an array`)
      const valS = value.map((el) => {
        if (isObject(el)) {
          assertWarning(
            !('once' in el),
            'The passToClient once setting is deprecated and no longer has any effect. Instead, see the upcoming .once.js suffix (see https://github.com/vikejs/vike/issues/2566 for more information).',
            { onlyOnce: true },
          )
          assertUsage(hasProp(el, 'prop', 'string'), errMsg)
          return el.prop
        }
        assertUsage(typeof el === 'string', errMsg)
        return el
      })
      /*/
      assertUsage(isArrayOfStrings(value), errMsg)
      //*/

      passToClient.push(...valS)
    })
  }

  objectAssign(pageContext, {
    Page: pageContext.exports.Page,
    _isHtmlOnly: isHtmlOnly,
    _passToClient: passToClient,
    headersResponse: resolveHeadersResponse(pageContext),
  })

  objectAssign(pageContext, {
    __getPageAssets: async () => {
      if ('_pageAssets' in pageContext) {
        return (pageContext as any as { _pageAssets: PageAsset[] })._pageAssets
      } else {
        const pageAssets = await getPageAssets(pageContext, clientDependencies, clientEntries)
        objectAssign(pageContext, { _pageAssets: pageAssets })
        return pageContext._pageAssets
      }
    },
  })

  // TO-DO/next-major-release: remove
  Object.assign(pageContext, {
    _getPageAssets: async () => {
      assertWarning(false, 'pageContext._getPageAssets() deprecated, see https://vike.dev/preloading', {
        onlyOnce: true,
        showStackTrace: true,
      })
      const pageAssetsOldFormat: {
        src: string
        assetType: 'script' | 'style' | 'preload'
        mediaType: null | NonNullable<MediaType>['mediaType']
        preloadType: null | NonNullable<MediaType>['assetType']
      }[] = []
      ;(await pageContext.__getPageAssets()).forEach((p) => {
        if (p.assetType === 'script' && p.isEntry) {
          pageAssetsOldFormat.push({
            src: p.src,
            preloadType: null,
            assetType: 'script',
            mediaType: p.mediaType,
          })
        }
        pageAssetsOldFormat.push({
          src: p.src,
          preloadType: p.assetType,
          assetType: p.assetType === 'style' ? 'style' : 'preload',
          mediaType: p.mediaType,
        })
      })
      return pageAssetsOldFormat
    },
  })

  await execHookServer('onCreatePageContext', pageContext)

  return pageContext
}

async function loadPageUserFiles(
  pageContext: PageContext_loadPageConfigsLazyServerSide & {
    _pageConfig: null | PageConfigRuntime
  },
) {
  const [{ configPublicPageLazy }] = await Promise.all([
    loadPageUserFiles_v1Design(pageContext),
    analyzePageClientSideInit(pageContext._globalContext._pageFilesAll, pageContext.pageId, {
      sharedPageFilesAlreadyLoaded: true,
    }),
  ])
  objectAssign(pageContext, configPublicPageLazy)
  return pageContext
}
async function loadPageUserFiles_v1Design(
  pageContext: PageContext_loadPageConfigsLazyServerSide & {
    _pageConfig: null | PageConfigRuntime
  },
) {
  const pageFilesServerSide = getPageFilesServerSide(pageContext._pageFilesAll, pageContext.pageId)
  const isDev = !pageContext._globalContext._isProduction
  const pageConfigLoaded = !pageContext._pageConfig
    ? null
    : await loadAndParseVirtualFilePageEntry(pageContext._pageConfig, isDev)
  await Promise.all(pageFilesServerSide.map((p) => p.loadFile?.()))
  const configPublicPageLazy = resolveVikeConfigPublicPageLazyLoaded(
    pageFilesServerSide,
    pageConfigLoaded,
    pageContext._globalContext._pageConfigGlobal,
  )
  return {
    configPublicPageLazy,
    pageFilesLoaded: pageFilesServerSide,
  }
}

function resolveHeadersResponse(pageContext: PageContextBeforeResolve): Headers {
  const headersResponse = mergeHeaders(pageContext.config.headersResponse)
  if (!headersResponse.get('Cache-Control')) {
    const cacheControl = getCacheControl(pageContext.pageId, pageContext._globalContext._pageConfigs)
    if (cacheControl) headersResponse.set('Cache-Control', cacheControl)
  }
  return headersResponse
}

function mergeHeaders(headersList: HeadersInit[] = []): Headers {
  const headersMerged = new Headers()
  headersList.forEach((headers) => {
    new Headers(headers).forEach((value, key) => {
      headersMerged.append(key, value)
    })
  })
  return headersMerged
}
