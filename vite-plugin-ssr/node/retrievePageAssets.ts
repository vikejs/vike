import { assert } from './utils'
import { ViteManifest } from './getViteManifest'
import type { ModuleNode, ViteDevServer } from 'vite'
import { getManifestEntry } from './getManifestEntry'

export { retrieveProdAssets }
export { retrieveStyleAssets }

async function retrieveStyleAssets(pageDependencies: string[], viteDevServer: ViteDevServer) {
  const visitedModules = new Set<string>()
  const assetUrls = new Set<string>()
  /*
  const pageViewFiles: string[] = pageContext._allPageFiles['.page'].map(({ filePath }) => filePath)
  const skipPageViewFiles = pageViewFiles.filter(
    (pageViewFile) => !pageDependencies.some((dep) => dep.includes(pageViewFile)),
  )
  */
  await Promise.all(
    pageDependencies.map(async (filePath) => {
      assert(filePath)
      const mod = await viteDevServer.moduleGraph.getModuleByUrl(filePath)
      collectCss(mod, assetUrls, visitedModules /*, skipPageViewFiles*/)
    }),
  )
  return Array.from(assetUrls)
}

async function retrieveProdAssets(
  pageDependencies: string[],
  clientManifest: ViteManifest,
  serverManifest: ViteManifest,
  root: string,
): Promise<string[]> {
  let assetUrls = new Set<string>()
  assert(clientManifest && serverManifest)
  const visistedAssets = new Set<string>()
  pageDependencies.forEach((filePath) => {
    const { manifestKey, manifest } = getManifestEntry(
      filePath,
      [
        /* We disable this for now; changes to Vite are required for this to work.
          serverManifest,
          */
        clientManifest,
      ],
      root,
      true,
    )
    // console.log('Manifest Entry', filePath, manifestKey, !!manifest)
    if (!manifest) return // `filePath` may be missing in the manifest; https://github.com/brillout/vite-plugin-ssr/issues/51
    const onlyCollectStaticAssets = manifest === serverManifest
    collectAssets(manifestKey, assetUrls, visistedAssets, manifest, onlyCollectStaticAssets)
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
  //skipPageViewFiles: string[],
): void {
  if (!mod) return
  if (!mod.url) return
  //if (skipPageViewFiles.some((pageViewFile) => mod.id && mod.id.includes(pageViewFile))) return
  if (visitedModules.has(mod.url)) return
  visitedModules.add(mod.url)
  if (mod.url.endsWith('.css') || (mod.id && /\?vue&type=style/.test(mod.id))) {
    styleUrls.add(mod.url)
  }
  mod.importedModules.forEach((dep) => {
    collectCss(dep, styleUrls, visitedModules /*, skipPageViewFiles*/)
  })
}
