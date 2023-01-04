export { retrieveAssetsProd }

import { assert, isNpmPackageModule } from '../../utils'
import { ViteManifest } from '../../helpers'
import { getManifestEntry } from './getManifestEntry'
import { extractAssetsAddQuery } from '../../plugin/plugins/extractAssetsPlugin/extractAssetsAddQuery'
import type { ClientDependency } from '../../../../shared/getPageFiles/analyzePageClientSide/ClientDependency'

function retrieveAssetsProd(
  clientDependencies: ClientDependency[],
  clientManifest: ViteManifest,
  includeAssetsImportedByServer: boolean,
  manifestKeyMap: Record<string, string>
): string[] {
  let assetUrls = new Set<string>()
  assert(clientManifest)
  const visistedAssets = new Set<string>()
  clientDependencies.forEach(({ id, onlyAssets }) => {
    if (onlyAssets && id.includes('.page.server.')) {
      if (
        includeAssetsImportedByServer &&
        // We assume that all npm packages have already built their VPS page files.
        //  - Bundlers (Rollup, esbuild, tsup, ...) extract the CSS out of JavaScript => we can assume JavaScript to not import any CSS/assets
        !isNpmPackageModule(id)
      ) {
        id = extractAssetsAddQuery(id)
      } else {
        return
      }
    }
    const { manifestKey } = getManifestEntry(id, clientManifest, manifestKeyMap)
    collectAssets(manifestKey, assetUrls, visistedAssets, clientManifest, onlyAssets)
  })

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
