export { retrieveProdAssets }
export { retrieveStyleAssets }
export type { ClientDependency }

import { assert } from './utils'
import { ViteManifest } from './getViteManifest'
import type { ModuleNode, ViteDevServer } from 'vite'
import { getManifestEntry } from './getManifestEntry'

type ClientDependency = {
  // Can be:
  //  - absolute path, or `
  //  - `@vite-plugin-ssr/dist/...`.
  id: string
  onlyAssets: boolean
}

async function retrieveStyleAssets(clientDependencies: ClientDependency[], viteDevServer: ViteDevServer) {
  const visitedModules = new Set<string>()
  const assetUrls = new Set<string>()
  await Promise.all(
    clientDependencies.map(async ({ id }) => {
      assert(id)
      const mod = await viteDevServer.moduleGraph.getModuleByUrl(id)
      collectCss(mod, assetUrls, visitedModules)
    }),
  )
  return Array.from(assetUrls)
}

async function retrieveProdAssets(
  clientDependencies: ClientDependency[],
  clientManifest: ViteManifest,
): Promise<string[]> {
  let assetUrls = new Set<string>()
  assert(clientManifest)
  const visistedAssets = new Set<string>()
  clientDependencies.forEach(({ id, onlyAssets }) => {
    const { manifestKey } = getManifestEntry(id, clientManifest, true)
    if (!manifestKey) return // `filePath` may be missing in the manifest; https://github.com/brillout/vite-plugin-ssr/issues/51
    collectAssets(manifestKey, assetUrls, visistedAssets, clientManifest, onlyAssets)
  })

  return Array.from(assetUrls)
}

function collectAssets(
  manifestKey: string,
  assetUrls: Set<string>,
  visistedAssets: Set<string>,
  manifest: ViteManifest,
  onlyCollectStaticAssets: boolean,
): void {
  if (visistedAssets.has(manifestKey)) return
  visistedAssets.add(manifestKey)

  const manifestEntry = manifest[manifestKey]
  assert(manifestEntry)
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

function collectCss(
  mod: ModuleNode | undefined,
  styleUrls: Set<string>,
  visitedModules: Set<string>,
): void {
  if (!mod) return
  if (!mod.url) return
  if (visitedModules.has(mod.url)) return
  visitedModules.add(mod.url)
  if (mod.url.endsWith('.css') || (mod.id && /\?vue&type=style/.test(mod.id))) {
    styleUrls.add(mod.url)
  }
  mod.importedModules.forEach((dep) => {
    collectCss(dep, styleUrls, visitedModules)
  })
}
