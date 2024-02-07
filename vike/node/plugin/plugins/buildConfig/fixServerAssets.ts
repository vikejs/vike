export { fixServerAssets }
export { fixServerAssets_isEnabled }

import fs from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { ViteManifest, ViteManifestEntry } from '../../../shared/ViteManifest.js'
import { OutDirs, assert, pLimit, unique } from '../../utils.js'
import { isVirtualFileIdPageConfigValuesAll } from '../../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
const manifestTempFile = '_temp_manifest.json'

/**
 * true  => use workaround config.build.ssrEmitAssets
 * false => use workaround extractAssets plugin
 *
 * Only used by V1 design.
 */
function fixServerAssets_isEnabled(): boolean {
  // We currently apply the workaround iff V1 design.
  // Shall we allow the user to toggle between the two workarounds? E.g. based on https://vike.dev/includeAssetsImportedByServer.
  return true
}

/** https://github.com/vikejs/vike/issues/1339 */
async function fixServerAssets(outDirs: OutDirs, assetsJsonFilePath: string) {
  const clientManifest = await loadManifest(outDirs.outDirClient)
  const serverManifest = await loadManifest(outDirs.outDirServer)

  const { filesToCopy, clientManifest: mergedManifest } = mergeManifests(clientManifest, serverManifest)
  await fs.writeFile(assetsJsonFilePath, JSON.stringify(mergedManifest, null, 2), 'utf-8')

  await copyAssets(filesToCopy, outDirs)
}
async function loadManifest(outDir: string) {
  const manifestFilePath = path.posix.join(outDir, manifestTempFile)
  const manifestFileContent = await fs.readFile(manifestFilePath, 'utf-8')
  assert(manifestFileContent)
  const manifest = JSON.parse(manifestFileContent)
  assert(manifest)
  return manifest
}
async function copyAssets(filesToCopy: string[], { outDirClient, outDirServer }: OutDirs) {
  const assetsDirServerAbs = path.posix.join(outDirServer, 'assets')
  if (!filesToCopy.length) return
  assert(existsSync(assetsDirServerAbs))
  const concurrencyLimit = pLimit(10)
  await Promise.all(
    filesToCopy.map((file) =>
      concurrencyLimit(() =>
        fs.cp(path.posix.join(outDirServer, file), path.posix.join(outDirClient, file), {
          recursive: true
        })
      )
    )
  )
  await fs.rm(assetsDirServerAbs, { recursive: true })
}

type Resource = { src: string; hash: string }
// Add serverManifest resources to clientManifest
function mergeManifests(clientManifest: ViteManifest, serverManifest: ViteManifest) {
  const entriesClient = new Map<
    string, // pageId
    {
      key: string
      css: Resource[]
      assets: Resource[]
    }
  >()
  const entriesServer = new Map<
    string, // pageId
    {
      css: Resource[]
      assets: Resource[]
    }
  >()

  for (const [key, entry] of Object.entries(clientManifest)) {
    const pageId = getPageId(key)
    if (!pageId) continue
    const resources = collectResources(entry, clientManifest)
    assert(!entriesClient.has(pageId))
    entriesClient.set(pageId, { key, ...resources })
  }
  for (const [key, entry] of Object.entries(serverManifest)) {
    const pageId = getPageId(key)
    if (!pageId) continue
    const resources = collectResources(entry, serverManifest)
    assert(!entriesServer.has(pageId))
    entriesServer.set(pageId, resources)
  }

  const filesToCopy: string[] = []
  for (const [pageId, entryClient] of entriesClient.entries()) {
    const cssToAdd: string[] = []
    const assetsToAdd: string[] = []

    const entryServer = entriesServer.get(pageId)
    if (entryServer) {
      cssToAdd.push(
        ...entryServer.css
          .filter((cssServer) => !entryClient.css.some((cssClient) => cssServer.hash === cssClient.hash))
          .map((css) => css.src)
      )
      assetsToAdd.push(
        ...entryServer.assets
          .filter((assertServer) => !entryClient.assets.some((assetClient) => assertServer.hash === assetClient.hash))
          .map((asset) => asset.src)
      )
    }

    const { key } = entryClient
    if (cssToAdd.length) {
      filesToCopy.push(...cssToAdd)
      clientManifest[key]!.css ??= []
      clientManifest[key]!.css?.push(...cssToAdd)
    }

    if (assetsToAdd.length) {
      filesToCopy.push(...assetsToAdd)
      clientManifest[key]!.assets ??= []
      clientManifest[key]!.assets?.push(...assetsToAdd)
    }
  }

  return { clientManifest, filesToCopy: unique(filesToCopy) }
}

function getPageId(key: string) {
  // Normalize from:
  //   ../../virtual:vike:pageConfigValuesAll:client:/pages/index
  // to:
  //   virtual:vike:pageConfigValuesAll:client:/pages/index
  // (This seems to be needed only for vitest tests that use Vite's build() API with an inline config.)
  key = key.substring(key.indexOf('virtual:vike'))
  const result = isVirtualFileIdPageConfigValuesAll(key)
  return result && result.pageId
}

function collectResources(entryRoot: ViteManifestEntry, manifest: ViteManifest) {
  const css: Resource[] = []
  const assets: Resource[] = []

  const entries = new Set([entryRoot])
  for (const entry of entries) {
    for (const entryImport of entry.imports ?? []) {
      entries.add(manifest[entryImport]!)
    }

    const entryCss = entry.css ?? []
    if (entry.file.endsWith('.css')) entryCss.push(entry.file)
    for (const src of entryCss) {
      const hash = getHash(src)
      css.push({ src, hash })
    }
    const entryAssets = entry.assets ?? []
    for (const src of entryAssets) {
      const hash = getHash(src)
      assets.push({ src, hash })
    }
  }

  return { css, assets }
}
function getHash(src: string) {
  const hash = src.split('.').at(-2)
  assert(hash)
  return hash
}
