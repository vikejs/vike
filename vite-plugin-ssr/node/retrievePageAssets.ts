export { retrieveAssetsProd }
export { retrieveAssetsDev }
export type { ClientDependency }

import { assert, assertUsage } from './utils'
import { ViteManifest } from './viteManifest'
import type { ModuleNode, ViteDevServer } from 'vite'
import { getManifestEntry } from './getManifestEntry'
import { extractStylesAddQuery } from './plugin/plugins/extractStylesPlugin/extractStylesAddQuery'

type ClientDependency = {
  // Can be:
  //  - absolute path, or `
  //  - `@vite-plugin-ssr/dist/...`.
  id: string
  onlyAssets: boolean
}

async function retrieveAssetsDev(clientDependencies: ClientDependency[], viteDevServer: ViteDevServer) {
  const visitedModules = new Set<string>()
  const assetUrls = new Set<string>()
  await Promise.all(
    clientDependencies.map(async ({ id }) => {
      if (id.startsWith('@@vite-plugin-ssr')) return // vps doesn't have any CSS
      assert(id)
      const { moduleGraph } = viteDevServer
      const [_, graphId] = await moduleGraph.resolveUrl(id)
      assert(graphId, { id })
      const mod = moduleGraph.getModuleById(graphId)
      if (!mod) {
        // `moduleGraph` is missing `.page.client.js` files on the very first render
        assert(id.includes('.page.client.'), { id })
        return
      }
      assert(mod, { id })
      collectCss(mod, assetUrls, visitedModules)
    }),
  )
  return Array.from(assetUrls)
}

async function retrieveAssetsProd(
  clientDependencies: ClientDependency[],
  clientManifest: ViteManifest,
): Promise<string[]> {
  let assetUrls = new Set<string>()
  assert(clientManifest)
  const visistedAssets = new Set<string>()
  clientDependencies.forEach(({ id, onlyAssets }) => {
    assert(!onlyAssets || id.includes('.page.server.'))
    if (onlyAssets) {
      id = extractStylesAddQuery(id)
    }
    const entry = getManifestEntry(id, clientManifest)
    assertUsage(
      entry,
      `You stumbled upon a rare Rollup bug. Reach out to the vite-plugin-ssr maintainer on GitHub or Discord. (The entry ${id} is missing in the manifest.)`,
    )
    /*
    assertWarning(
      entry,
      "You stumbled upon a Rollup bug that is known to the vite-plugin-ssr maintainer. It's usually benign but it may cause problems. Feel free to reach out on GitHub or Discord.",
      { onlyOnce: true },
    )
    if (!entry) {
      // Circumvent Rollup Bug, see https://github.com/brillout/vite-plugin-ssr/issues/51
      return
    }
    */
    const { manifestKey } = entry
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

function collectCss(mod: ModuleNode, styleUrls: Set<string>, visitedModules: Set<string>): void {
  assert(mod)
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
