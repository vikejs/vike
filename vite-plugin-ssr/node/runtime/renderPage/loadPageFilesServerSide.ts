export { loadPageFilesServerSide }
export type { PageFiles }
export type { PageContext_loadPageFilesServerSide }

import { type PageFile, getExportUnion, getPageFilesServerSide, getExports } from '../../../shared/getPageFiles.js'
import { analyzePageClientSideInit } from '../../../shared/getPageFiles/analyzePageClientSide.js'
import { assertWarning, objectAssign, PromiseType } from '../utils.js'
import { getPageAssets, PageContextGetPageAssets, type PageAsset } from './getPageAssets.js'
import { debugPageFiles, type PageContextDebug } from './debugPageFiles.js'
import type { PageConfig } from '../../../shared/page-configs/PageConfig.js'
import { findPageConfig } from '../../../shared/page-configs/findPageConfig.js'
import { analyzePage } from './analyzePage.js'
import { getGlobalContext } from '../globalContext.js'
import type { MediaType } from './inferMediaType.js'
import { loadPageCode } from '../../../shared/page-configs/loadPageCode.js'

type PageContext_loadPageFilesServerSide = PageContextGetPageAssets &
  PageContextDebug & {
    urlOriginal: string
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfig[]
  }
type PageFiles = PromiseType<ReturnType<typeof loadPageFilesServerSide>>
async function loadPageFilesServerSide(pageContext: { _pageId: string } & PageContext_loadPageFilesServerSide) {
  const pageConfig = findPageConfig(pageContext._pageConfigs, pageContext._pageId) // Make pageConfig globally available as pageContext._pageConfig?

  const [{ config, configEntries, exports, exportsAll, pageExports, pageFilesLoaded, pageConfigLoaded }] =
    await Promise.all([
      loadPageFiles(pageContext._pageFilesAll, pageConfig, pageContext._pageId, !getGlobalContext().isProduction),
      analyzePageClientSideInit(pageContext._pageFilesAll, pageContext._pageId, { sharedPageFilesAlreadyLoaded: true })
    ])
  const { isHtmlOnly, isClientRouting, clientEntries, clientDependencies, pageFilesClientSide, pageFilesServerSide } =
    analyzePage(pageContext._pageFilesAll, pageConfig, pageContext._pageId)
  const pageContextAddendum = {}
  objectAssign(pageContextAddendum, {
    config,
    configEntries,
    exports,
    exportsAll,
    pageExports,
    Page: exports.Page,
    _isHtmlOnly: isHtmlOnly,
    _passToClient: getExportUnion(exportsAll, 'passToClient'),
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
      assertWarning(false, 'pageContext._getPageAssets() deprecated, see https://vite-plugin-ssr.com/preload', {
        onlyOnce: true,
        showStackTrace: true
      })
      const pageAssetsOldFormat: {
        src: string
        assetType: 'script' | 'style' | 'preload'
        mediaType: null | NonNullable<MediaType>['mediaType']
        preloadType: null | 'image' | 'script' | 'font' | 'style'
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

async function loadPageFiles(pageFilesAll: PageFile[], pageConfig: null | PageConfig, pageId: string, isDev: boolean) {
  const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
  const pageConfigLoaded = !pageConfig ? null : await loadPageCode(pageConfig, isDev)
  await Promise.all(pageFilesServerSide.map((p) => p.loadFile?.()))
  const { config, configEntries, exports, exportsAll, pageExports } = getExports(pageFilesServerSide, pageConfigLoaded)
  return {
    config,
    configEntries,
    exports,
    exportsAll,
    pageExports,
    pageFilesLoaded: pageFilesServerSide,
    pageConfigLoaded
  }
}
