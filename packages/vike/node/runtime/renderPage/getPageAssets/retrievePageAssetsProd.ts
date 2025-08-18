export { retrievePageAssetsProd }
export { resolveIncludeAssetsImportedByServer }

import { assert, isImportPathNpmPackage } from '../../utils.js'
import type { ViteManifest } from '../../../../types/ViteManifest.js'
import { getManifestEntry } from './getManifestEntry.js'
import { extractAssetsAddQuery } from '../../../shared/extractAssetsQuery.js'
import type { ClientDependency } from '../../../../shared/getPageFiles/analyzePageClientSide/ClientDependency.js'
import type { ConfigResolved } from '../../../../types/index.js'

function retrievePageAssetsProd(
  assetsManifest: ViteManifest,
  clientDependencies: ClientDependency[],
  clientEntries: string[],
  config: ConfigResolved,
) {
  const clientEntriesSrc = clientEntries.map((clientEntry) => resolveClientEntriesProd(clientEntry, assetsManifest))
  const assetUrls = retrieveAssetsProd(clientDependencies, assetsManifest, config)
  return { clientEntriesSrc, assetUrls }
}
function resolveClientEntriesProd(clientEntry: string, assetsManifest: ViteManifest): string {
  const { manifestEntry } = getManifestEntry(clientEntry, assetsManifest)
  assert(manifestEntry.isEntry || manifestEntry.isDynamicEntry || clientEntry.endsWith('.css'), { clientEntry })
  let { file } = manifestEntry
  assert(!file.startsWith('/'))
  return '/' + file
}

function retrieveAssetsProd(
  clientDependencies: ClientDependency[],
  assetsManifest: ViteManifest,
  config: ConfigResolved,
): string[] {
  const includeAssetsImportedByServer = resolveIncludeAssetsImportedByServer(config)

  let assetUrls = new Set<string>()
  assert(assetsManifest)
  const visistedAssets = new Set<string>()
  clientDependencies.forEach(({ id, onlyAssets, eagerlyImported }) => {
    if (eagerlyImported) return // Eagerly imported assets aren't imported with import() and therefore don't create a new Rollup entry and aren't listed in the manifest file

    // TO-DO/next-major-release: remove
    if (
      includeAssetsImportedByServer &&
      onlyAssets &&
      id.includes('.page.server.') &&
      // We assume that all npm packages have already built their files: bundlers (Rollup, esbuild, tsup, ...) extract the CSS out of JavaScript => we can assume JavaScript to not import any CSS/assets.
      !isImportPathNpmPackage(id, {
        // I presume Vite already resolves path aliases when Vite sets the module's id
        cannotBePathAlias: true,
      })
    ) {
      id = extractAssetsAddQuery(id)
    }

    const { manifestKey } = getManifestEntry(id, assetsManifest)
    collectAssets(manifestKey, assetUrls, visistedAssets, assetsManifest, onlyAssets)
  })

  collectSingleStyle(assetUrls, assetsManifest)

  return Array.from(assetUrls)
}

function collectAssets(
  manifestKey: string,
  assetUrls: Set<string>,
  visistedAssets: Set<string>,
  assetsManifest: ViteManifest,
  onlyCollectStaticAssets: boolean,
): void {
  if (visistedAssets.has(manifestKey)) return
  visistedAssets.add(manifestKey)

  const manifestEntry = assetsManifest[manifestKey]
  assert(manifestEntry, { manifestKey })
  const { file } = manifestEntry
  if (!onlyCollectStaticAssets) {
    assetUrls.add(`/${file}`)
  }

  const { imports = [], assets = [], css = [] } = manifestEntry

  for (const manifestKey of imports) {
    const importManifestEntry = assetsManifest[manifestKey]
    assert(importManifestEntry)
    collectAssets(manifestKey, assetUrls, visistedAssets, assetsManifest, onlyCollectStaticAssets)
  }

  for (const cssAsset of css) {
    assetUrls.add(`/${cssAsset}`)
  }
  for (const asset of assets) {
    assetUrls.add(`/${asset}`)
  }
}

// Support `config.build.cssCodeSplit: false`, see https://github.com/vikejs/vike/issues/644
function collectSingleStyle(assetUrls: Set<string>, assetsManifest: ViteManifest) {
  const style = assetsManifest['style.css']
  if (style && Object.values(assetsManifest).filter((asset) => asset.file.endsWith('.css')).length === 1) {
    assetUrls.add(`/${style.file}`)
  }
}

function resolveIncludeAssetsImportedByServer(config: ConfigResolved): boolean {
  return config.includeAssetsImportedByServer ?? true
}
