export { getPageAssets }
export { PageAsset }

import { assert, normalizePath, prependBaseUrl, assertPosixPath, toPosixPath } from '../utils'
import { retrieveAssetsDev, retrieveAssetsProd } from '../retrievePageAssets'
import type { ViteManifest } from '../viteManifest'
import path from 'path'
import { inferMediaType } from '../html/inferMediaType'
import { getManifestEntry } from '../getManifestEntry'
import type { ViteDevServer } from 'vite'
import type { ClientDependency } from '../../shared/getPageFiles/analyzePageClientSide/ClientDependency'
import type { MediaType } from '../html/inferMediaType'
import {sortPageAssetsForEarlyHintsHeader} from './getPageAssets/sortPageAssetsForEarlyHintsHeader'

type PageAsset = {
  src: string
  assetType: null | NonNullable<MediaType>['assetType']
  mediaType: null | NonNullable<MediaType>['mediaType']
  isEntry: boolean
}

async function getPageAssets(
  pageContext: {
    _baseUrl: string
    _baseAssets: string | null
    _isProduction: boolean
    _viteDevServer: null | ViteDevServer
    _manifestClient: null | ViteManifest
    _includeAssetsImportedByServer: boolean
    _manifestPlugin?: { manifestKeyMap: Record<string, string> }
  },
  clientDependencies: ClientDependency[],
  clientEntries: string[],
  isPreRendering: boolean
): Promise<PageAsset[]> {
  const isDev = !isPreRendering && !pageContext._isProduction

  let assetUrls: string[]
  let clientEntriesSrc: string[]
  if (isDev) {
    const viteDevServer = pageContext._viteDevServer
    assert(viteDevServer)
    clientEntriesSrc = clientEntries.map((clientEntry) => resolveClientEntriesDev(clientEntry, viteDevServer))
    assetUrls = await retrieveAssetsDev(clientDependencies, viteDevServer)
  } else {
    const clientManifest = pageContext._manifestClient
    assert(clientManifest)
    const manifestKeyMap = pageContext._manifestPlugin?.manifestKeyMap
    assert(manifestKeyMap)
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
  clientEntriesSrc.forEach((clientEntrySrc) => {
    pageAssets.push({
      src: clientEntrySrc,
      assetType: 'script',
      mediaType: 'text/javascript',
      isEntry: true
    })
  })
  assetUrls.forEach((src) => {
    if (clientEntriesSrc.includes(src)) return

    const { mediaType = null, assetType = null } = inferMediaType(src) || {}

    if (isDev && assetType === 'style') {
      // https://github.com/brillout/vite-plugin-ssr/issues/449
      if (src.endsWith('?inline')) {
        return
      }
      // https://github.com/brillout/vite-plugin-ssr/issues/401
      src = src + '?direct'
    }

    pageAssets.push({
      src,
      assetType,
      mediaType,
      // Vite automatically injects CSS, not only in development, but also in production (albeit with a FOUC). Therefore, strictly speaking, CSS aren't entries. We still, however, set `isEntry: true` for CSS, in order to denote page assets that should absolutely be injected in the HTML, regardless of preload strategy (not injecting CSS leads to FOUC).
      isEntry: assetType === 'style'
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

  sortPageAssetsForEarlyHintsHeader(pageAssets, pageContext)

  return pageAssets
}

function resolveClientEntriesDev(clientEntry: string, viteDevServer: ViteDevServer): string {
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
  if (!clientEntry.startsWith('@@vite-plugin-ssr/')) {
    assert(path.posix.isAbsolute(clientEntry))
    filePath = path.posix.join(root, clientEntry)
  } else {
    assert(clientEntry.startsWith('@@vite-plugin-ssr/dist/esm/client/'))
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
  }
  if (!filePath.startsWith('/')) {
    assert(process.platform === 'win32')
    filePath = '/' + filePath
  }
  filePath = '/@fs' + filePath
  return filePath
}
function resolveClientEntriesProd(
  clientEntry: string,
  clientManifest: ViteManifest,
  manifestKeyMap: Record<string, string>
): string {
  const entry = getManifestEntry(clientEntry, clientManifest, manifestKeyMap)
  assert(entry)
  const { manifestEntry } = entry
  // TODO: importing assets (e.g. SVG images) from CSS => does VPS crawl the link?
  assert(manifestEntry.isEntry || manifestEntry.isDynamicEntry || clientEntry.endsWith('.css'), { clientEntry })
  let { file } = manifestEntry
  assert(!file.startsWith('/'))
  return '/' + file
}
