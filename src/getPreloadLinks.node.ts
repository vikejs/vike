import { getGlobal } from './global.node'
import { assert, assertWarning } from './utils/assert'
import { getViteManifest, ViteManifest } from './getViteManfiest.node'

export { getPreloadLinks }

function getPreloadLinks(
  pageFilePaths: string[],
  browserEntryPath: string
): string[] {
  const { isProduction } = getGlobal()
  if (!isProduction) {
    return []
  }
  const manifest = getViteManifest()

  let preloadLinks: string[] = []

  ;[...pageFilePaths, browserEntryPath].forEach((filePath) =>
    preloadLinks.push(...retrievePreloadLinks(filePath, manifest))
  )

  preloadLinks = unique(preloadLinks)

  return preloadLinks
}

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr))
}

function retrievePreloadLinks(
  filePath: string,
  manifest: ViteManifest
): Set<string> {
  if (filePath.startsWith('/')) {
    filePath = filePath.slice(1)
  }
  const manifestEntry = manifest[filePath]
  //console.log(filePath, manifest)
  assert(manifestEntry)

  const preloadLinks = new Set<string>()

  const { imports = [], assets = [], css = [] } = manifestEntry
  for (const importAsset of imports) {
    const importManifestEntry = manifest[importAsset]
    const { file } = importManifestEntry
    retrievePreloadLinks(importAsset, manifest).forEach((link) =>
      preloadLinks.add(link)
    )
    if (!file.endsWith('.js')) {
      assertWarning(false, `${file} will not be preloaded`)
      continue
    }
    assert(file.startsWith('assets/'))
    preloadLinks.add(`<link rel="modulepreload" crossorigin href="/${file}">`)
  }

  for (const cssAsset of css) {
    if (!cssAsset.endsWith('.css')) {
      assertWarning(false, `${cssAsset} will not be preloaded`)
      continue
    }
    assert(cssAsset.startsWith('assets/'))
    preloadLinks.add(`<link rel="stylesheet" href="/${cssAsset}">`)
  }

  for (let asset of assets) {
    assert(asset.startsWith('assets/'))
    preloadLinks.add(`<link rel="preload" href="/${asset}">`)
  }

  return preloadLinks
}
