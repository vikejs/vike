export { getPageAssets }

import { assert, assertUsage, higherFirst, normalizePath, prependBaseUrl, assertPosixPath, toPosixPath } from '../utils'
import { retrieveStyleAssets, retrieveProdAssets, ClientDependency } from '../retrievePageAssets'
import { getSsrEnv } from '../ssrEnv'
import { getViteManifest, ViteManifest } from '../getViteManifest'
import path from 'path'
import { inferMediaType } from '../html/inferMediaType'
import { PageAsset } from '../html/injectAssets'
import { getManifestEntry } from '../getManifestEntry'

async function getPageAssets(
  pageContext: {
    _baseUrl: string
    _baseAssets: string | null
  },
  clientDependencies: ClientDependency[],
  clientEntries: string[],
  isPreRendering: boolean,
): Promise<PageAsset[]> {
  const { isProduction = false, viteDevServer } = getSsrEnv()

  let assetUrls: string[]
  let clientEntriesSrc: string[]
  if (isPreRendering || isProduction) {
    const manifests = retrieveViteManifest(isPreRendering)
    const clientManifest = manifests.clientManifest
    clientEntriesSrc = clientEntries && resolveClientEntriesProd(clientEntries, clientManifest!)
    assetUrls = await retrieveProdAssets(clientDependencies, clientManifest)
  } else {
    assert(viteDevServer)
    clientEntriesSrc = clientEntries && resolveClientEntriesDev(clientEntries)
    assetUrls = await retrieveStyleAssets(clientDependencies, viteDevServer)
  }

  let pageAssets: PageAsset[] = []
  clientEntriesSrc.forEach((clientEntrySrc) => {
    pageAssets.push({
      src: clientEntrySrc,
      assetType: 'script',
      mediaType: 'text/javascript',
      preloadType: null,
    })
  })
  assetUrls.forEach((src) => {
    const { mediaType = null, preloadType = null } = inferMediaType(src) || {}
    const assetType = mediaType === 'text/css' ? 'style' : 'preload'
    pageAssets.push({
      src,
      assetType,
      mediaType,
      preloadType,
    })
  })

  pageAssets = pageAssets.map((pageAsset) => {
    const baseUrlAssets = pageContext._baseAssets || pageContext._baseUrl
    pageAsset.src = prependBaseUrl(normalizePath(pageAsset.src), baseUrlAssets)
    return pageAsset
  })

  sortPageAssetsForHttpPush(pageAssets)

  return pageAssets
}

function sortPageAssetsForHttpPush(pageAssets: PageAsset[]) {
  pageAssets.sort(
    higherFirst(({ assetType, preloadType }) => {
      let priority = 0

      // CSS has highest priority
      if (assetType === 'style') return priority
      priority--
      if (preloadType === 'style') return priority
      priority--

      // Visual assets have high priority
      if (preloadType === 'font') return priority
      priority--
      if (preloadType === 'image') return priority
      priority--

      // JavaScript has lowest priority
      if (preloadType === 'script') return priority - 1
      if (assetType === 'script') return priority - 2

      return priority
    }),
  )
}

function retrieveViteManifest(isPreRendering: boolean): { clientManifest: ViteManifest; serverManifest: ViteManifest } {
  const { clientManifest, serverManifest, clientManifestPath, serverManifestPath } = getViteManifest()
  const userOperation = isPreRendering
    ? 'running `$ vite-plugin-ssr prerender`'
    : 'running the server with `isProduction: true`'
  assertUsage(
    clientManifest && serverManifest,
    'You are ' +
      userOperation +
      " but you didn't build your app yet: make sure to run `$ vite build && vite build --ssr` before. (Following build manifest is missing: `" +
      clientManifestPath +
      '` and/or `' +
      serverManifestPath +
      '`.)',
  )
  return { clientManifest, serverManifest }
}

function resolveClientEntriesDev(clientEntries: string[]): string[] {
  return clientEntries.map((clientEntry) => {
    assertPosixPath(clientEntry)
    let filePath: string
    if (!clientEntry.startsWith('@@vite-plugin-ssr/')) {
      assert(path.posix.isAbsolute(clientEntry))
      filePath = clientEntry
    } else {
      const req = require // Prevent webpack from bundling client code
      const res = req.resolve
      // Current file: node_modules/vite-plugin-ssr/dist/cjs/node/html/injectAssets.js
      filePath = toPosixPath(res(clientEntry.replace('@@vite-plugin-ssr/', '../../../../')))
    }
    if (!filePath.startsWith('/')) {
      assert(process.platform === 'win32')
      filePath = '/' + filePath
    }
    filePath = '/@fs' + filePath
    return filePath
  })
}
function resolveClientEntriesProd(clientEntries: string[], clientManifest: ViteManifest): string[] {
  return clientEntries.map((clientEntry) => {
    const { manifestEntry } = getManifestEntry(clientEntry, clientManifest, false)
    assert(manifestEntry.isEntry || manifestEntry.isDynamicEntry)
    let { file } = manifestEntry
    assert(!file.startsWith('/'))
    return '/' + file
  })
}
