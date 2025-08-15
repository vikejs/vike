export { loadPageConfigsLazyServerSideAndExecHook }
export type { PageContext_loadPageConfigsLazyServerSide }
export type { PageConfigsLazy }

import { type PageFile, type VikeConfigPublicPageLazy, getPageFilesServerSide } from '../../../shared/getPageFiles.js'
import { resolveVikeConfigPublicPageLazy } from '../../../shared/page-configs/resolveVikeConfigPublic.js'
import { analyzePageClientSideInit } from '../../../shared/getPageFiles/analyzePageClientSide.js'
import { assertUsage, assertWarning, hasProp, isArray, isObject, objectAssign, PromiseType } from '../utils.js'
import { getPageAssets, PageContextGetPageAssets, type PageAsset } from './getPageAssets.js'
import { debugPageFiles, type PageContextDebugRouteMatches } from './debugPageFiles.js'
import type { PageConfigGlobalRuntime, PageConfigRuntime } from '../../../types/PageConfig.js'
import { findPageConfig } from '../../../shared/page-configs/findPageConfig.js'
import { analyzePage } from './analyzePage.js'
import type { GlobalContextServerInternal } from '../globalContext.js'
import type { MediaType } from './inferMediaType.js'
import { loadConfigValues } from '../../../shared/page-configs/loadConfigValues.js'
import { execHookServer, type PageContextExecHookServer } from './execHookServer.js'
import { getCacheControl } from './getCacheControl.js'
import type { PassToClient } from '../html/serializeContext.js'

type PageContextExecuteHook = Omit<
  PageContextExecHookServer,
  keyof Awaited<ReturnType<typeof loadPageConfigsLazyServerSide>>
>
type PageContext_loadPageConfigsLazyServerSide = PageContextGetPageAssets &
  PageContextDebugRouteMatches & {
    pageId: string
    urlOriginal: string
    _globalContext: GlobalContextServerInternal
  }
type PageConfigsLazy = PromiseType<ReturnType<typeof loadPageConfigsLazyServerSide>>

async function loadPageConfigsLazyServerSideAndExecHook<
  PageContext extends PageContext_loadPageConfigsLazyServerSide & PageContextExecuteHook,
>(pageContext: PageContext) {
  const pageContextAddendum = await loadPageConfigsLazyServerSide(pageContext)
  objectAssign(pageContext, pageContextAddendum)

  await execHookServer('onCreatePageContext', pageContext)

  return pageContext
}

// TODO/now: define new function resolveAfterLoad() ?

async function loadPageConfigsLazyServerSide(pageContext: PageContext_loadPageConfigsLazyServerSide) {
  const pageConfig = findPageConfig(pageContext._globalContext._pageConfigs, pageContext.pageId) // Make pageConfig globally available as pageContext._pageConfig ?

  const globalContext = pageContext._globalContext
  const [{ pageFilesLoaded, configPublicPageLazy }] = await Promise.all([
    loadPageConfigFiles(
      pageContext._globalContext._pageFilesAll,
      pageConfig,
      globalContext._pageConfigGlobal,
      pageContext.pageId,
      !globalContext._isProduction,
    ),
    analyzePageClientSideInit(pageContext._globalContext._pageFilesAll, pageContext.pageId, {
      sharedPageFilesAlreadyLoaded: true,
    }),
  ])
  const { isHtmlOnly, isClientRouting, clientEntries, clientDependencies, pageFilesClientSide, pageFilesServerSide } =
    await analyzePage(pageContext._globalContext._pageFilesAll, pageConfig, pageContext.pageId, globalContext)
  const isV1Design = !!pageConfig

  const passToClient: PassToClient = []
  const errMsgSuffix = ' should be an array of strings.'
  if (!isV1Design) {
    configPublicPageLazy.exportsAll.passToClient?.forEach((e) => {
      assertUsage(hasProp(e, 'exportValue', 'string[]'), `${e.exportSource}${errMsgSuffix}`)
      passToClient.push(...e.exportValue)
    })
  } else {
    configPublicPageLazy.from.configsCumulative.passToClient?.values.forEach((v) => {
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

  const pageContextAddendum = {}
  objectAssign(pageContextAddendum, configPublicPageLazy)
  objectAssign(pageContextAddendum, {
    Page: configPublicPageLazy.exports.Page,
    _isHtmlOnly: isHtmlOnly,
    _passToClient: passToClient,
    _pageFilePathsLoaded: pageFilesLoaded.map((p) => p.filePath),
    headersResponse: resolveHeadersResponse(pageContext, pageContextAddendum),
  })

  objectAssign(pageContextAddendum, {
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
  Object.assign(pageContextAddendum, {
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
      ;(await pageContextAddendum.__getPageAssets()).forEach((p) => {
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

  debugPageFiles({
    pageContext,
    isHtmlOnly,
    isClientRouting,
    pageFilesLoaded,
    pageFilesClientSide,
    pageFilesServerSide,
    clientEntries,
    clientDependencies,
  })

  return pageContextAddendum
}

async function loadPageConfigFiles(
  pageFilesAll: PageFile[],
  pageConfig: null | PageConfigRuntime,
  pageConfigGlobal: PageConfigGlobalRuntime,
  pageId: string,
  isDev: boolean,
) {
  const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
  const pageConfigLoaded = !pageConfig ? null : await loadConfigValues(pageConfig, isDev)
  await Promise.all(pageFilesServerSide.map((p) => p.loadFile?.()))
  const configPublicPageLazy = resolveVikeConfigPublicPageLazy(pageFilesServerSide, pageConfigLoaded, pageConfigGlobal)
  return {
    configPublicPageLazy,
    pageFilesLoaded: pageFilesServerSide,
  }
}

function resolveHeadersResponse(
  pageContext: {
    pageId: null | string
    _globalContext: GlobalContextServerInternal
  },
  pageContextAddendum: VikeConfigPublicPageLazy,
): Headers {
  const headersResponse = mergeHeaders(pageContextAddendum.config.headersResponse)
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
