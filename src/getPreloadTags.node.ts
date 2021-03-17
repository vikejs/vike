import { getGlobal } from './global.node'
import { assert } from './utils/assert'
import { getViteManifest, ViteManifest } from './getViteManfiest.node'
import { ModuleNode } from 'vite'
import { getUserFiles } from './user-files/getUserFiles.shared'

export { getPreloadTags }

async function getPreloadTags(dependencies: string[]): Promise<string[]> {
  const { isProduction } = getGlobal()

  let preloadUrls = new Set<string>()
  if (!isProduction) {
    const { viteDevServer } = getGlobal()
    const visitedModules = new Set<string>()
    const skipPageFiles = (await getPageFiles()).filter(
      (pageFile) => !dependencies.some((dep) => dep.includes(pageFile))
    )
    await Promise.all(
      dependencies.map(async (filePath) => {
        assert(filePath)
        const mod = await viteDevServer.moduleGraph.getModuleByUrl(filePath)
        collectCss(mod, preloadUrls, visitedModules, skipPageFiles)
      })
    )
  } else {
    const { root } = getGlobal()
    const { serverManifest, clientManifest } = getViteManifest()
    const visistedAssets = new Set<string>()
    dependencies.forEach((filePath) => {
      const modulePath = getModulePath(filePath, root)
      let manifest: ViteManifest | undefined = undefined
      if (serverManifest[modulePath]) manifest = serverManifest
      if (clientManifest[modulePath]) manifest = clientManifest
      assert(manifest)
      const onlyCollectStaticAssets = manifest === serverManifest
      collectAssets(
        modulePath,
        preloadUrls,
        visistedAssets,
        manifest,
        onlyCollectStaticAssets
      )
    })
  }

  const preloadTags = Array.from(preloadUrls).map(getPreloadTag)
  return preloadTags
}

async function getPageFiles(): Promise<string[]> {
  const files = await getUserFiles('.page')
  const pageFiles = files.map(({ filePath }) => filePath)
  return pageFiles
}

function collectAssets(
  modulePath: string,
  preloadUrls: Set<string>,
  visistedAssets: Set<string>,
  manifest: ViteManifest,
  onlyCollectStaticAssets: boolean
): void {
  if (visistedAssets.has(modulePath)) return
  visistedAssets.add(modulePath)
  const manifestEntry = manifest[modulePath]
  assert(manifestEntry)

  const { imports = [], assets = [], css = [] } = manifestEntry
  for (const importAsset of imports) {
    const importManifestEntry = manifest[importAsset]
    const { file } = importManifestEntry
    assert(file.startsWith('assets/'))
    if (!onlyCollectStaticAssets) {
      preloadUrls.add(`/${file}`)
    }
    collectAssets(
      importAsset,
      preloadUrls,
      visistedAssets,
      manifest,
      onlyCollectStaticAssets
    )
  }
  for (const cssAsset of css) {
    assert(cssAsset.startsWith('assets/'))
    preloadUrls.add(`/${cssAsset}`)
  }

  for (const asset of assets) {
    assert(asset.startsWith('assets/'))
    preloadUrls.add(`/${asset}`)
  }
}

function getModulePath(filePath: string, root: string): string {
  let modulePath = filePath
  if (modulePath.startsWith(root)) {
    return modulePath.slice(root.length)
  }
  if (modulePath.startsWith('/')) {
    modulePath = modulePath.slice(1)
  }
  return modulePath
}

function getPreloadTag(href: string): string {
  assert(href.startsWith('/'))
  assert(!href.startsWith('//'))
  if (href.endsWith('.css')) {
    return `<link rel="stylesheet" href="${href}">`
  }
  if (href.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${href}">`
  }
  return `<link rel="preload" href="${href}">`
}

function collectCss(
  mod: ModuleNode | undefined,
  preloadUrls: Set<string>,
  visitedModules: Set<string>,
  skipPageFiles: string[]
): void {
  if (!mod) return
  if (!mod.url) return
  if (skipPageFiles.some((pageFile) => mod.id && mod.id.includes(pageFile)))
    return
  if (visitedModules.has(mod.url)) return
  visitedModules.add(mod.url)
  if (mod.url.endsWith('.css') || (mod.id && /\?vue&type=style/.test(mod.id))) {
    preloadUrls.add(mod.url)
  }
  mod.importedModules.forEach((dep) => {
    collectCss(dep, preloadUrls, visitedModules, skipPageFiles)
  })
}
