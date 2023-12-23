export { loadPageFilesServerSide, logImportError }
export type { PageFiles }
export type { PageContext_loadPageFilesServerSide }

import { type PageFile, getExportUnion, getPageFilesServerSide, getExports } from '../../../shared/getPageFiles.js'
import { analyzePageClientSideInit } from '../../../shared/getPageFiles/analyzePageClientSide.js'
import { assertWarning, objectAssign, PromiseType } from '../utils.js'
import { getPageAssets, PageContextGetPageAssets, type PageAsset } from './getPageAssets.js'
import { debugPageFiles, type PageContextDebugRouteMatches } from './debugPageFiles.js'
import type { PageConfigRuntime } from '../../../shared/page-configs/PageConfig.js'
import { findPageConfig } from '../../../shared/page-configs/findPageConfig.js'
import { analyzePage } from './analyzePage.js'
import { getGlobalContext } from '../globalContext.js'
import type { MediaType } from './inferMediaType.js'
import { loadConfigValues } from '../../../shared/page-configs/loadConfigValues.js'
import pc from '@brillout/picocolors'

type PageContext_loadPageFilesServerSide = PageContextGetPageAssets &
  PageContextDebugRouteMatches & {
    urlOriginal: string
    _pageFilesAll: PageFile[]
    _pageConfigs: PageConfigRuntime[]
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
      assertWarning(false, 'pageContext._getPageAssets() deprecated, see https://vike.dev/preload', {
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

async function loadPageFiles(
  pageFilesAll: PageFile[],
  pageConfig: null | PageConfigRuntime,
  pageId: string,
  isDev: boolean
) {
  try {
    const pageFilesServerSide = getPageFilesServerSide(pageFilesAll, pageId)
    const pageConfigLoaded = !pageConfig ? null : await loadConfigValues(pageConfig, isDev)
    await Promise.all(pageFilesServerSide.map((p) => p.loadFile?.()))
    const { config, configEntries, exports, exportsAll, pageExports } = getExports(
      pageFilesServerSide,
      pageConfigLoaded
    )
    return {
      config,
      configEntries,
      exports,
      exportsAll,
      pageExports,
      pageFilesLoaded: pageFilesServerSide,
      pageConfigLoaded
    }
  } catch (error) {
    logImportError(error)
    throw error
  }
}

function logImportError(error: unknown) {
  const errString = parseError(error)
  if (!errString) {
    return
  }

  const shouldShowMessage = new RegExp(
    [
      `Error: Element type is invalid`,
      `TypeError: require is not a function`,
      // `TypeError: Cannot read properties of undefined`,
      `SyntaxError: Named export`,
      `SyntaxError: Cannot use import statement outside a module`,
      `ReferenceError: exports is not defined.*node_modules`,
      `ERR_UNSUPPORTED_DIR_IMPORT.*node_modules`,
      `ERR_UNKNOWN_FILE_EXTENSION.*node_modules`,
      `ERR_REQUIRE_ESM`
    ].join('|'),
    's'
  )
  const shouldParsePackageName = new RegExp(
    [
      `SyntaxError: Cannot use import statement outside a module`,
      `SyntaxError: Named export`,
      `ERR_UNSUPPORTED_DIR_IMPORT.*node_modules`,
      `ERR_UNKNOWN_FILE_EXTENSION.*node_modules`,
      `ReferenceError: exports is not defined.*node_modules`
    ].join('|'),
    's'
  )

  if (shouldShowMessage.test(errString)) {
    let packageName = ''

    if (shouldParsePackageName.test(errString)) {
      packageName = parsePackageName(errString)
    }

    if (packageName) {
      console.log(
        `Please include ${pc.green(packageName)} in ${pc.green('ssr.noExternal')} ${pc.green(
          'https://vike.dev/broken-npm-package'
        )}`
      )
    } else {
      console.log(`Failed to import a package. To fix this: ${pc.green('https://vike.dev/broken-npm-package')}`)
    }

    return packageName
  }
}

const parseError = (error: unknown) => {
  if (!error) {
    return
  }
  let parsed = ''

  if (typeof error === 'string') {
    parsed = error
  } else if (typeof error === 'object') {
    if ('name' in error && typeof error.name === 'string') {
      parsed = `${parsed}\n${error.name}`
    }

    if ('message' in error && typeof error.message === 'string') {
      parsed = `${parsed}\n${error.message}`
    }

    if ('stack' in error && typeof error.stack === 'string') {
      parsed = `${parsed}\n${error.stack}`
    }
  }

  return parsed
}

const parsePackageName = (errString: string) => {
  let packageName = ''
  const match = /import.*?from ?"(.*?)"/.exec(errString)
  if (match?.length && typeof match[1] === 'string') {
    packageName = match[1]
  }
  if (!packageName) {
    const firstNodeModulesLine = errString.split('\n').find((line) => line.includes('node_modules/'))

    if (firstNodeModulesLine) {
      packageName = firstNodeModulesLine.split('node_modules/').pop()!.split('/').slice(0, 2).join('/')
    }
  }
  const isNamespacedPackage = packageName.startsWith('@')
  if (!isNamespacedPackage) {
    packageName = packageName.split('/').shift()!
  }

  if (packageName) {
    if (!packageName.startsWith('"')) {
      packageName = `"${packageName}`
    }
    if (!packageName.endsWith('"')) {
      packageName = `${packageName}"`
    }
  }
  return packageName
}
