export { loadPageFilesServer }
export type { PageFiles }
export type { PageContext_loadPageFilesServer }

import { type PageFile, getExportUnion } from '../../../shared/getPageFiles'
import { analyzePageClientSideInit } from '../../../shared/getPageFiles/analyzePageClientSide'
import { assertWarning, objectAssign, PromiseType } from '../utils'
import { getPageAssets, PageContextGetPageAssets, type PageAsset } from './getPageAssets'
import { loadPageFilesServerSide } from '../../../shared/getPageFiles/analyzePageServerSide/loadPageFilesServerSide'
import { debugPageFiles, type PageContextDebug } from './debugPageFiles'
import type { PageConfig } from '../../../shared/page-configs/PageConfig'
import { findPageConfig } from '../../../shared/page-configs/findPageConfig'
import { analyzePage } from './analyzePage'
import { getGlobalContext } from '../globalContext'
import type { MediaType } from './inferMediaType'

type PageContext_loadPageFilesServer = PageContextGetPageAssets &
  PageContextDebug & {
    urlOriginal: string
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfig[]
  }
type PageFiles = PromiseType<ReturnType<typeof loadPageFilesServer>>
async function loadPageFilesServer(pageContext: { _pageId: string } & PageContext_loadPageFilesServer) {
  const pageConfig = findPageConfig(pageContext._pageConfigs, pageContext._pageId) // Make pageConfig globally available as pageContext._pageConfig?

  const [{ config, configList, exports, exportsAll, pageExports, pageFilesLoaded, pageConfigLoaded }] = await Promise.all([
    loadPageFilesServerSide(
      pageContext._pageFilesAll,
      pageConfig,
      pageContext._pageId,
      !getGlobalContext().isProduction
    ),
    analyzePageClientSideInit(pageContext._pageFilesAll, pageContext._pageId, { sharedPageFilesAlreadyLoaded: true })
  ])
  const { isHtmlOnly, isClientRouting, clientEntries, clientDependencies, pageFilesClientSide, pageFilesServerSide } =
    analyzePage(pageContext._pageFilesAll, pageConfig, pageContext._pageId)
  const pageContextAddendum = {}
  objectAssign(pageContextAddendum, {
    config,
    configList,
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

  // TODO: remove this on next semver major
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
