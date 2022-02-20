import { getSsrEnv } from './ssrEnv'
import { assert, getRoot } from './utils'
import { ViteManifest } from './getViteManifest'
import type { ModuleNode } from 'vite'
import { AllPageFiles } from '../shared/getPageFiles'
import { getManifestEntry } from './getManifestEntry'

export { getPreloadUrls }

async function getPreloadUrls(
  pageContext: {
    _allPageFiles: AllPageFiles
  },
  dependencies: string[],
  clientManifest: null | ViteManifest,
  serverManifest: null | ViteManifest,
): Promise<string[]> {
  const ssrEnv = getSsrEnv()
  const root = getRoot()

  let preloadUrls = new Set<string>()
  if (!ssrEnv.isProduction) {
    const visitedModules = new Set<string>()
    const pageViewFiles: string[] = pageContext._allPageFiles['.page'].map(({ filePath }) => filePath)
    const skipPageViewFiles = pageViewFiles.filter(
      (pageViewFile) => !dependencies.some((dep) => dep.includes(pageViewFile)),
    )
    await Promise.all(
      dependencies.map(async (filePath) => {
        assert(filePath)
        const mod = await ssrEnv.viteDevServer.moduleGraph.getModuleByUrl(filePath)
        collectCss(mod, preloadUrls, visitedModules, skipPageViewFiles)
      }),
    )
  } else {
    assert(clientManifest && serverManifest)
    const visistedAssets = new Set<string>()
    dependencies.forEach((filePath) => {
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
      collectAssets(manifestKey, preloadUrls, visistedAssets, manifest, onlyCollectStaticAssets)
    })
  }

  return Array.from(preloadUrls)
}

function collectAssets(
  manifestKey: string,
  preloadUrls: Set<string>,
  visistedAssets: Set<string>,
  manifest: ViteManifest,
  onlyCollectStaticAssets: boolean,
): void {
  if (visistedAssets.has(manifestKey)) return
  const manifestEntry = manifest[manifestKey]
  assert(manifestEntry)
  visistedAssets.add(manifestKey)

  const { imports = [], assets = [], css = [] } = manifestEntry
  for (const manifestKey of imports) {
    const importManifestEntry = manifest[manifestKey]
    assert(importManifestEntry)
    const { file } = importManifestEntry
    if (!onlyCollectStaticAssets) {
      preloadUrls.add(`/${file}`)
    }
    collectAssets(manifestKey, preloadUrls, visistedAssets, manifest, onlyCollectStaticAssets)
  }
  for (const cssAsset of css) {
    preloadUrls.add(`/${cssAsset}`)
  }

  for (const asset of assets) {
    preloadUrls.add(`/${asset}`)
  }
}

function collectCss(
  mod: ModuleNode | undefined,
  preloadUrls: Set<string>,
  visitedModules: Set<string>,
  skipPageViewFiles: string[],
): void {
  if (!mod) return
  if (!mod.url) return
  if (skipPageViewFiles.some((pageViewFile) => mod.id && mod.id.includes(pageViewFile))) return
  if (visitedModules.has(mod.url)) return
  visitedModules.add(mod.url)
  if (mod.url.endsWith('.css') || (mod.id && /\?vue&type=style/.test(mod.id))) {
    preloadUrls.add(mod.url)
  }
  mod.importedModules.forEach((dep) => {
    collectCss(dep, preloadUrls, visitedModules, skipPageViewFiles)
  })
}
