import { assert, assertWarning } from './utils/assert'
import { route } from './route.shared'
import {
  Html,
  Url,
  PageId,
  PageView,
  PageServerConfig,
  FilePathFromRoot
} from './types'
import { findUserFilePath, loadUserFile } from './findUserFiles'
import { renderHtmlTemplate } from './renderHtml'
import { getGlobal } from './global'

export { PageConfig, addWindowType } from './types'
export { render }

async function render(url: Url): Promise<Html | null> {
  const pageId = await route(url)
  if (!pageId) {
    return null
  }
  const html = await renderPageToHtml(pageId, url)
  return html
}

async function renderPageToHtml(pageId: PageId, url: Url): Promise<Html> {
  const pageView: PageView = await loadUserFile('.page', { pageId })
  assert(pageView)
  const pageFilePath: FilePathFromRoot | null = await findUserFilePath(
    '.page',
    { pageId }
  )
  assert(pageFilePath)
  assert(pageFilePath.startsWith('/'))

  let htmlTemplate: Html =
    (await loadUserFile('.html', { pageId })) ||
    (await loadUserFile('.html', { defaultFile: true }))
  assert(htmlTemplate)
  const pageServerConfig: PageServerConfig =
    (await loadUserFile('.server', { pageId })) ||
    (await loadUserFile('.server', { defaultFile: true }))
  assert(pageServerConfig.render)

  const pageViewHtml: Html = await pageServerConfig.render({ pageView })

  htmlTemplate = await applyViteHtmlTransform(htmlTemplate, url)

  let browserEntryPath: FilePathFromRoot | null =
    (await findUserFilePath('.browser', { pageId })) ||
    (await findUserFilePath('.browser', { defaultFile: true }))
  assert(browserEntryPath)

  const preloadLinks = getPreloadLinks(pageFilePath, browserEntryPath)

  assert(browserEntryPath)
  const initialProps = {}
  const scriptUrl = await pathRelativeToRoot(browserEntryPath)
  const html = renderHtmlTemplate({
    htmlTemplate,
    pageViewHtml,
    preloadLinks,
    scripts: [{ scriptUrl }],
    initialProps
  })

  return html
}

type Manifest = Record<string, ManifestChunk>

type ManifestChunk = {
  src?: string
  file: string
  css?: string[]
  assets?: string[]
  isEntry?: boolean
  isDynamicEntry?: boolean
  imports?: string[]
  dynamicImports?: string[]
}

function getPreloadLinks(
  pageFilePath: FilePathFromRoot,
  browserEntryPath: FilePathFromRoot
): string[] {
  const manifest = getViteManifest()
  const preloadLinks = unique([
    ...retrievePreloadLinks(pageFilePath, manifest),
    ...retrievePreloadLinks(browserEntryPath, manifest)
  ])
  return preloadLinks
}

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr))
}

function retrievePreloadLinks(
  filePath: FilePathFromRoot,
  manifest: Manifest
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

async function pathRelativeToRoot(filePath: FilePathFromRoot): Promise<string> {
  assert(filePath.startsWith('/'))
  const { isProduction } = getGlobal()

  if (!isProduction) {
    return filePath
  } else {
    const manifest = getViteManifest()
    const manifestKey = filePath.slice(1)
    const manifestVal = viteManifest[manifestKey]
    assert(manifestVal)
    assert(manifestVal.isEntry)
    const { file } = manifestVal
    assert(!file.startsWith('/'))
    return '/' + file
  }
}

var viteManifest: Manifest
function getViteManifest(): Manifest {
  const { root } = getGlobal()
  if (!viteManifest) {
    viteManifest = require(`${root}/dist/client/manifest.json`)
  }
  return viteManifest
}

async function applyViteHtmlTransform(html: Html, url: Url): Promise<Html> {
  const { viteDevServer, isProduction } = getGlobal()
  if (isProduction) {
    return html
  }
  html = await viteDevServer.transformIndexHtml(url, html)
  return html
}
