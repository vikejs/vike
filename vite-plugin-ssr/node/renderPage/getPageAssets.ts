export { getPageAssets }
export type { PageAsset }
export type { PageContextGetPageAssets }

import {
  assert,
  normalizePath,
  prependBaseUrl,
  assertPosixPath,
  toPosixPath,
  isNpmPackageModule,
  unique,
  isNotNullish
} from '../utils'
import { retrieveAssetsDev, retrieveAssetsProd } from './retrievePageAssets'
import path from 'path'
import { inferMediaType, type MediaType, type ViteManifest } from '../helpers'
import { getManifestEntry } from '../getManifestEntry'
import type { ViteDevServer } from 'vite'
import type { ClientDependency } from '../../shared/getPageFiles/analyzePageClientSide/ClientDependency'
import { sortPageAssetsForEarlyHintsHeader } from './getPageAssets/sortPageAssetsForEarlyHintsHeader'
import type { ConfigVpsResolved } from '../plugin/plugins/config/ConfigVps'
import { getGlobalContext } from '../globalContext'

type PageAsset = {
  src: string
  assetType: null | NonNullable<MediaType>['assetType']
  mediaType: null | NonNullable<MediaType>['mediaType']
  isEntry: boolean
}

type PageContextGetPageAssets = {
  _baseUrl: string
  _baseAssets: string | null
  _includeAssetsImportedByServer: boolean
}

async function getPageAssets(
  pageContext: PageContextGetPageAssets,
  clientDependencies: ClientDependency[],
  clientEntries: string[]
): Promise<PageAsset[]> {
  const globalContext = getGlobalContext()
  const isDev = !globalContext.isProduction

  let assetUrls: string[]
  let clientEntriesSrc: string[]
  if (isDev) {
    const { viteDevServer, configVps } = globalContext
    clientEntriesSrc = clientEntries.map((clientEntry) =>
      resolveClientEntriesDev(clientEntry, viteDevServer, configVps)
    )
    assetUrls = await retrieveAssetsDev(clientDependencies, viteDevServer)
  } else {
    const { pluginManifest, clientManifest } = globalContext
    const manifestKeyMap = pluginManifest.manifestKeyMap
    clientEntriesSrc = clientEntries.map((clientEntry) =>
      resolveClientEntriesProd(clientEntry, clientManifest, manifestKeyMap)
    )
    assetUrls = retrieveAssetsProd(
      clientDependencies,
      clientManifest,
      pageContext._includeAssetsImportedByServer,
      manifestKeyMap
    )
  }

  let pageAssets: PageAsset[] = []
  unique([...clientEntriesSrc, ...assetUrls]).forEach((src: string) => {
    const { mediaType = null, assetType = null } = inferMediaType(src) || {}

    if (isDev && assetType === 'style') {
      // https://github.com/brillout/vite-plugin-ssr/issues/449
      if (src.endsWith('?inline')) {
        return
      }
      // https://github.com/brillout/vite-plugin-ssr/issues/401
      src = src + '?direct'
    }

    const isEntry =
      clientEntriesSrc.includes(src) ||
      // Vite automatically injects CSS, not only in development, but also in production (albeit with a FOUC). Therefore, strictly speaking, CSS aren't entries. We still, however, set `isEntry: true` for CSS, in order to denote page assets that should absolutely be injected in the HTML, regardless of preload strategy (not injecting CSS leads to FOUC).
      assetType === 'style'

    pageAssets.push({
      src,
      assetType,
      mediaType,
      isEntry
    })
  })

  pageAssets.forEach(({ src }) => {
    assert(1 === pageAssets.filter((p) => p.src === src).length)
  })

  pageAssets = pageAssets.map((pageAsset) => {
    const baseUrlAssets = pageContext._baseAssets || pageContext._baseUrl
    pageAsset.src = prependBaseUrl(normalizePath(pageAsset.src), baseUrlAssets)
    return pageAsset
  })

  sortPageAssetsForEarlyHintsHeader(pageAssets)

  return pageAssets
}

function resolveClientEntriesDev(
  clientEntry: string,
  viteDevServer: ViteDevServer,
  configVps: ConfigVpsResolved
): string {
  let root = viteDevServer.config.root
  assert(root)
  root = toPosixPath(root)

  // The `?import` suffix is needed for MDX to be transpiled:
  //   - Not transpiled: `/pages/markdown.page.mdx`
  //   - Transpiled: `/pages/markdown.page.mdx?import`
  // But `?import` doesn't work with `/@fs/`:
  //   - Not transpiled: /@fs/home/runner/work/vite-plugin-ssr/vite-plugin-ssr/examples/react-full/pages/markdown.page.mdx
  //   - Not transpiled: /@fs/home/runner/work/vite-plugin-ssr/vite-plugin-ssr/examples/react-full/pages/markdown.page.mdx?import
  if (clientEntry.endsWith('?import')) {
    assert(clientEntry.startsWith('/'))
    return clientEntry
  }

  assertPosixPath(clientEntry)
  let filePath: string
  if (path.posix.isAbsolute(clientEntry)) {
    // User files
    filePath = path.posix.join(root, clientEntry)
  } else if (clientEntry.startsWith('@@vite-plugin-ssr/')) {
    // VPS client entry
    assert(clientEntry.endsWith('.js'))
    const req = require // Prevent webpack from bundling client code
    const res = req.resolve
    try {
      // For Vitest
      // Current file: node_modules/vite-plugin-ssr/node/html/injectAssets.js
      filePath = toPosixPath(
        res(clientEntry.replace('@@vite-plugin-ssr/dist/esm/client/', '../../client/').replace('.js', '.ts'))
      )
    } catch {
      // For users
      // Current file: node_modules/vite-plugin-ssr/dist/cjs/node/html/injectAssets.js
      filePath = toPosixPath(
        res(clientEntry.replace('@@vite-plugin-ssr/dist/esm/client/', '../../../../dist/esm/client/'))
      )
    }
  } else {
    // VPS extensions
    assert(isNpmPackageModule(clientEntry)) // TODO: factor out check? Make test more precise to check presence in extensions[number].pageFiles?
    const extensionPageFile = configVps.extensions
      .map(({ pageFilesDist }) => pageFilesDist)
      .flat()
      .filter(isNotNullish)
      .find((e) => e.importPath === clientEntry)
    assert(extensionPageFile, clientEntry)
    filePath = extensionPageFile.filePath
  }

  if (!filePath.startsWith('/')) {
    assert(process.platform === 'win32')
    filePath = '/' + filePath
  }

  filePath = '/@fs' + filePath
  assertPosixPath(filePath)

  return filePath
}
function resolveClientEntriesProd(
  clientEntry: string,
  clientManifest: ViteManifest,
  manifestKeyMap: Record<string, string>
): string {
  const { manifestEntry } = getManifestEntry(clientEntry, clientManifest, manifestKeyMap)
  assert(manifestEntry.isEntry || manifestEntry.isDynamicEntry || clientEntry.endsWith('.css'), { clientEntry })
  let { file } = manifestEntry
  assert(!file.startsWith('/'))
  return '/' + file
}
