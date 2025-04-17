export { loadUserFilesServerSide }
export type { PageFiles }
export type { PageContext_loadUserFilesServerSide }

import { type PageFile, getPageFilesServerSide } from '../../../shared/getPageFiles.js'
import { getPageConfigUserFriendly_oldDesign } from '../../../shared/page-configs/getPageConfigUserFriendly.js'
import { analyzePageClientSideInit } from '../../../shared/getPageFiles/analyzePageClientSide.js'
import {
  assert,
  assertUsage,
  assertWarning,
  hasProp,
  isArrayOfStrings,
  objectAssign,
  PromiseType,
  isArray
} from '../utils.js'
import { getPageAssets, PageContextGetPageAssets, type PageAsset } from './getPageAssets.js'
import { debugPageFiles, type PageContextDebugRouteMatches } from './debugPageFiles.js'
import type { PageConfigGlobalRuntime, PageConfigRuntime } from '../../../shared/page-configs/PageConfig.js'
import { findPageConfig } from '../../../shared/page-configs/findPageConfig.js'
import { analyzePage } from './analyzePage.js'
import type { GlobalContextInternal } from '../globalContextServerSide.js'
import type { MediaType } from './inferMediaType.js'
import { loadConfigValues } from '../../../shared/page-configs/loadConfigValues.js'

type PageContext_loadUserFilesServerSide = PageContextGetPageAssets &
  PageContextDebugRouteMatches & {
    urlOriginal: string
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfigRuntime[]
    _globalContext: GlobalContextInternal
  }
type PageFiles = PromiseType<ReturnType<typeof loadUserFilesServerSide>>
async function loadUserFilesServerSide(pageContext: { pageId: string } & PageContext_loadUserFilesServerSide) {
  const pageConfig = findPageConfig(pageContext._pageConfigs, pageContext.pageId) // Make pageConfig globally available as pageContext._pageConfig?

  const globalContext = pageContext._globalContext
  const [{ pageFilesLoaded, pageContextExports }] = await Promise.all([
    loadPageUserFiles(
      pageContext._pageFilesAll,
      pageConfig,
      globalContext.pageConfigGlobal,
      pageContext.pageId,
      !globalContext.isProduction
    ),
    analyzePageClientSideInit(pageContext._pageFilesAll, pageContext.pageId, { sharedPageFilesAlreadyLoaded: true })
  ])
  const { isHtmlOnly, isClientRouting, clientEntries, clientDependencies, pageFilesClientSide, pageFilesServerSide } =
    await analyzePage(pageContext._pageFilesAll, pageConfig, pageContext.pageId, globalContext)
  const isV1Design = !!pageConfig

  const passToClient: string[] = []
  const errMsg = ' should be an array of strings.'
  if (!isV1Design) {
    pageContextExports.exportsAll.passToClient?.forEach((e) => {
      assertUsage(hasProp(e, 'exportValue', 'string[]'), `${e.exportSource}${errMsg}`)
      passToClient.push(...e.exportValue)
    })
  } else {
    pageContextExports.configEntries.passToClient?.forEach((e) => {
      const { configValue } = e
      assert(isArray(configValue))
      const vals = configValue.flat(1)
      // TODO: improve error message by using (upcoming) new data structure instead of configEntries
      assertUsage(isArrayOfStrings(vals), `${e.configDefinedAt}${errMsg}`)
      passToClient.push(...vals)
    })
  }

  const pageContextAddendum = {}
  objectAssign(pageContextAddendum, pageContextExports)
  objectAssign(pageContextAddendum, {
    Page: pageContextExports.exports.Page,
    _isHtmlOnly: isHtmlOnly,
    _passToClient: passToClient,
    _pageFilePathsLoaded: pageFilesLoaded.map((p) => p.filePath)
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
    }
  })

  // TODO/v1-release: remove
  Object.assign(pageContextAddendum, {
    _getPageAssets: async () => {
      assertWarning(false, 'pageContext._getPageAssets() deprecated, see https://vike.dev/preloading', {
        onlyOnce: true,
        showStackTrace: true
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
            mediaType: p.mediaType
          })
        }
        pageAssetsOldFormat.push({
          src: p.src,
          preloadType: p.assetType,
          assetType: p.assetType === 'style' ? 'style' : 'preload',
          mediaType: p.mediaType
        })
      })
      return pageAssetsOldFormat
    }
  })

  {
    debugPageFiles({
      pageContext,
      isHtmlOnly,
      isClientRouting,
      pageFilesLoaded,
      pageFilesClientSide,
      pageFilesServerSide,
      clientEntries,
      clientDependencies
    })
  }

  return pageContextAddendum
}

async function loadPageUserFiles(
  pageFilesAll: PageFile[],
  pageConfig: null | PageConfigRuntime,
  pageConfigGlobal: PageConfigGlobalRuntime,
  pageId: string,
  isDev: boolean
) {
  const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
  const pageConfigLoaded = !pageConfig ? null : await loadConfigValues(pageConfig, isDev)
  await Promise.all(pageFilesServerSide.map((p) => p.loadFile?.()))
  const pageContextExports = getPageConfigUserFriendly_oldDesign(
    pageFilesServerSide,
    pageConfigLoaded,
    pageConfigGlobal
  )
  return {
    pageContextExports,
    pageFilesLoaded: pageFilesServerSide
  }
}
