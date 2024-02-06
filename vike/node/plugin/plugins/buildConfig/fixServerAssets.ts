export { fixServerAssets }
export { fixServerAssets_isEnabled }

import fs from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { ViteManifest, ViteManifestEntry } from '../../../shared/ViteManifest.js'
import { OutDirs, assert, pLimit, unique } from '../../utils.js'
const manifestTempFile = '_temp_manifest.json'

/**
 * true  => use workaround config.build.ssrEmitAssets
 * false => use workaround extractAssets plugin
 *
 * Only used by V1 design.
 */
function fixServerAssets_isEnabled(): boolean {
  // We currently apply the workaround iff V1 design.
  // Shall we allow the user to toggle the workaround? E.g. using https://vike.dev/includeAssetsImportedByServer.
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
  const manifestFilePath = path.join(outDir, manifestTempFile)
  const manifestFileContent = await fs.readFile(manifestFilePath, 'utf-8')
  assert(manifestFileContent)
  const manifest = JSON.parse(manifestFileContent)
  assert(manifest)
  return manifest
}
async function copyAssets(filesToCopy: string[], { outDirClient, outDirServer }: OutDirs) {
  const assetsDirServerAbs = path.posix.join(outDirServer, 'assets')
  if (!existsSync(assetsDirServerAbs)) {
    return
  }
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

// The missing assets in the clientManifest are added from the serverManifest, based on V1 pageId.
// Page entries that don't exist in the client manifest are NOT added
// This assumes that there is a page entry in the client manifest for every page(not compatible with v0.4)
// because v0.4 doesn't include html-only pages in the client manifest
function mergeManifests(clientManifest: ViteManifest, serverManifest: ViteManifest) {
  const entriesToAssetsClient = new Map<
    string,
    {
      pageId: string
      css: { src: string; hash: string }[]
      assets: { src: string; hash: string }[]
    }
  >()

  const entriesToAssetsServer = new Map<
    string,
    {
      pageId: string
      css: { src: string; hash: string }[]
      assets: { src: string; hash: string }[]
    }
  >()

  for (const [key, entry] of Object.entries(clientManifest)) {
    const pageId = determinePageIdV1(key)
    if (!pageId) {
      continue
    }
    const assets = collectAssetsForEntry(clientManifest, entry)
    assert(!entriesToAssetsClient.has(key))
    entriesToAssetsClient.set(key, { ...assets, pageId })
  }

  for (const [key, entry] of Object.entries(serverManifest)) {
    const pageId = determinePageIdV1(key)
    if (!pageId) {
      continue
    }
    const assets = collectAssetsForEntry(serverManifest, entry)
    assert(!entriesToAssetsServer.has(key))
    entriesToAssetsServer.set(key, { ...assets, pageId })
  }

  const filesToCopy = []

  for (const [clientEntryKey, clientEntryValue] of entriesToAssetsClient.entries()) {
    const cssToAdd: string[] = []
    const assetsToAdd: string[] = []

    for (const [, serverEntryValue] of entriesToAssetsServer.entries()) {
      if (clientEntryValue.pageId !== serverEntryValue.pageId) {
        continue
      }

      cssToAdd.push(
        ...serverEntryValue.css
          .filter((serverCss) => clientEntryValue.css.every((clientCss) => serverCss.hash !== clientCss.hash))
          .map((css) => css.src)
      )
      assetsToAdd.push(
        ...serverEntryValue.assets
          .filter((serverAsset) =>
            clientEntryValue.assets.every((clientAsset) => serverAsset.hash !== clientAsset.hash)
          )
          .map((asset) => asset.src)
      )
    }

    if (cssToAdd.length) {
      filesToCopy.push(...cssToAdd)
      clientManifest[clientEntryKey]!.css ??= []
      clientManifest[clientEntryKey]!.css?.push(...cssToAdd)
    }

    if (assetsToAdd.length) {
      filesToCopy.push(...assetsToAdd)
      clientManifest[clientEntryKey]!.assets ??= []
      clientManifest[clientEntryKey]!.assets?.push(...assetsToAdd)
    }
  }

  return { clientManifest, filesToCopy: unique(filesToCopy) }
}

function determinePageIdV1(entry: string) {
  const splitEntry = entry.split(':/pages')
  const isV1 = splitEntry.length === 2
  if (!isV1) {
    return ''
  }
  return splitEntry.pop()
}

function collectAssetsForEntry(manifest: ViteManifest, entry: ViteManifestEntry) {
  const css = []
  const assets = []

  const entries = new Set([entry])
  for (const entry of entries) {
    for (const import_ of entry.imports ?? []) {
      entries.add(manifest[import_]!)
    }

    const cssFiles = entry.css ?? []
    if (entry.file.endsWith('.css')) cssFiles.push(entry.file)
    for (let id of cssFiles) {
      const hash = hashCss(id)
      assert(hash)
      css.push({ src: id, hash })
    }
    for (let id of entry.assets ?? []) {
      const hash = hashOtherAsset(id)
      assert(hash)
      assets.push({ src: id, hash })
    }
  }
  return { css, assets }
}
function hashCss(id: string) {
  return id.split('.').at(-2)
}
function hashOtherAsset(id: string) {
  return id.split('.').at(-2)
}
