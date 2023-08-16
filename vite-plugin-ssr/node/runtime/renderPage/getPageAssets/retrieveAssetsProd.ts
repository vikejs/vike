export { retrieveAssetsProd }

import { assert, isNpmPackageImport } from '../../utils.js'
import type { ViteManifest } from '../../../shared/ViteManifest.js'
import { getManifestEntry } from './getManifestEntry.js'
import { extractAssetsAddQuery } from '../../../shared/extractAssetsQuery.js'
import type { ClientDependency } from '../../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.js'

function retrieveAssetsProd(
  clientDependencies: ClientDependency[],
  clientManifest: ViteManifest,
  includeAssetsImportedByServer: boolean,
  manifestKeyMap: Record<string, string>
): string[] {
  let assetUrls = new Set<string>()
  assert(clientManifest)
  const visistedAssets = new Set<string>()
  clientDependencies.forEach(({ id, onlyAssets, eagerlyImported }) => {
    if (eagerlyImported) return // Eagerly imported assets aren't imported with import() and therefore don't create a new Rollup entry and aren't listed in the manifest file
    if (onlyAssets) {
      if (!includeAssetsImportedByServer) return
      // We assume that all npm packages have already built their VPS page files.
      //  - Bundlers (Rollup, esbuild, tsup, ...) extract the CSS out of JavaScript => we can assume JavaScript to not import any CSS/assets
      if (isNpmPackageImport(id)) return
      if (id.includes('.page.server.')) {
        id = extractAssetsAddQuery(id)
      }
    }
    const { manifestKey } = getManifestEntry(id, clientManifest, manifestKeyMap)
    collectAssets(manifestKey, assetUrls, visistedAssets, clientManifest, onlyAssets)
  })

  collectSingleStyle(assetUrls, clientManifest)

  return Array.from(assetUrls)
}

function collectAssets(
  manifestKey: string,
  assetUrls: Set<string>,
  visistedAssets: Set<string>,
  manifest: ViteManifest,
  onlyCollectStaticAssets: boolean
): void {
  if (visistedAssets.has(manifestKey)) return
  visistedAssets.add(manifestKey)

  const manifestEntry = manifest[manifestKey]
  assert(manifestEntry, { manifestKey })
  const { file } = manifestEntry
  if (!onlyCollectStaticAssets) {
    assetUrls.add(`/${file}`)
  }

  const { imports = [], assets = [], css = [] } = manifestEntry

  for (const manifestKey of imports) {
    const importManifestEntry = manifest[manifestKey]
    assert(importManifestEntry)
    collectAssets(manifestKey, assetUrls, visistedAssets, manifest, onlyCollectStaticAssets)
  }

  for (const cssAsset of css) {
    assetUrls.add(`/${cssAsset}`)
  }
  for (const asset of assets) {
    assetUrls.add(`/${asset}`)
  }
}

// Support `config.build.cssCodeSplit: false`, https://github.com/brillout/vite-plugin-ssr/issues/644
function collectSingleStyle(assetUrls: Set<string>, manifest: ViteManifest) {
  const style = manifest['style.css']
  if (style && Object.values(manifest).filter((asset) => asset.file.endsWith('.css')).length === 1) {
    assetUrls.add(`/${style.file}`)
  }
}
