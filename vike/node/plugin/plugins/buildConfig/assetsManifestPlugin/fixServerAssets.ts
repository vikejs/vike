export { fixServerAssets }
export { fixServerAssets_isEnabled }
export { fixServerAssets_assertUsageCssCodeSplit }
export { fixServerAssets_assertUsageCssTarget }

import fs from 'fs/promises'
import fs_sync from 'fs'
import path from 'path'
import { existsSync } from 'fs'
import { ViteManifest, ViteManifestEntry } from '../../../../shared/ViteManifest.js'
import { assert, assertWarning, isEqualStringList, pLimit, unique } from '../../../utils.js'
import { isVirtualFileIdPageConfigValuesAll } from '../../../../shared/virtual-files/virtualFilePageConfigValuesAll.js'
import { manifestTempFile } from '../../buildConfig.js'
import { ResolvedConfig } from 'vite'
import { getAssetsDir } from '../../../shared/getAssetsDir.js'
import pc from '@brillout/picocolors'
import { isV1Design } from '../../importUserCode/v1-design/getVikeConfig.js'
import { getOutDirs } from '../../../shared/getOutDirs.js'
import { viteIsSSR } from '../../../shared/viteIsSSR.js'

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
async function fixServerAssets(
  config: ResolvedConfig
): Promise<{ clientManifestMod: ViteManifest; serverManifestMod: ViteManifest }> {
  const outDirs = getOutDirs(config)
  const clientManifest = await loadManifest(outDirs.outDirClient)
  const serverManifest = await loadManifest(outDirs.outDirServer)

  const { clientManifestMod, serverManifestMod, filesToMove, filesToRemove } = addServerAssets(
    clientManifest,
    serverManifest
  )
  await copyAssets(filesToMove, filesToRemove, config)

  return { clientManifestMod, serverManifestMod }
}
async function loadManifest(outDir: string) {
  const manifestFilePath = path.posix.join(outDir, manifestTempFile)
  const manifestFileContent = await fs.readFile(manifestFilePath, 'utf-8')
  assert(manifestFileContent)
  const manifest = JSON.parse(manifestFileContent)
  assert(manifest)
  return manifest
}
async function copyAssets(filesToMove: string[], filesToRemove: string[], config: ResolvedConfig) {
  const { outDirClient, outDirServer } = getOutDirs(config)
  const assetsDir = getAssetsDir(config)
  const assetsDirServer = path.posix.join(outDirServer, assetsDir)
  if (!filesToMove.length && !filesToRemove.length && !existsSync(assetsDirServer)) return
  assert(existsSync(assetsDirServer))
  const concurrencyLimit = pLimit(10)
  await Promise.all(
    filesToMove.map((file) =>
      concurrencyLimit(async () => {
        const source = path.posix.join(outDirServer, file)
        const target = path.posix.join(outDirClient, file)
        await fs.mkdir(path.posix.dirname(target), { recursive: true })
        await fs.rename(source, target)
      })
    )
  )
  filesToRemove.forEach((file) => {
    const filePath = path.posix.join(outDirServer, file)
    fs_sync.unlinkSync(filePath)
  })
  /* We cannot do that because, with some edge case Rollup settings (outputing JavaScript chunks and static assets to the same directoy), this removes JavaScript chunks, see https://github.com/vikejs/vike/issues/1154#issuecomment-1975762404
  await fs.rm(assetsDirServer, { recursive: true })
  */
  removeEmptyDirectories(assetsDirServer)
}

type Resource = { src: string; hash: string }
// Add serverManifest resources to clientManifest
function addServerAssets(clientManifest: ViteManifest, serverManifest: ViteManifest) {
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
      key: string
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
    entriesServer.set(pageId, { key, ...resources })
  }

  let filesToMove: string[] = []
  let filesToRemove: string[] = []

  // Copy page assets
  for (const [pageId, entryClient] of entriesClient.entries()) {
    const entryServer = entriesServer.get(pageId)
    if (!entryServer) continue

    const cssToMove: string[] = []
    const cssToRemove: string[] = []
    const assetsToMove: string[] = []
    const assetsToRemove: string[] = []

    entryServer.css.forEach((cssServer) => {
      if (!entryClient.css.some((cssClient) => cssServer.hash === cssClient.hash)) {
        cssToMove.push(cssServer.src)
      } else {
        cssToRemove.push(cssServer.src)
      }
    })
    entryServer.assets.forEach((assetServer) => {
      if (!entryClient.assets.some((assetClient) => assetServer.hash === assetClient.hash)) {
        assetsToMove.push(assetServer.src)
      } else {
        assetsToRemove.push(assetServer.src)
      }
    })

    if (cssToMove.length) {
      const { key } = entryClient
      filesToMove.push(...cssToMove)
      clientManifest[key]!.css ??= []
      clientManifest[key]!.css?.push(...cssToMove)
    }
    if (cssToRemove.length) {
      const { key } = entryServer
      filesToRemove.push(...cssToRemove)
      serverManifest[key]!.css ??= []
      serverManifest[key]!.css = serverManifest[key]!.css!.filter((entry) => !cssToRemove.includes(entry))
    }

    if (assetsToMove.length) {
      const { key } = entryClient
      filesToMove.push(...assetsToMove)
      clientManifest[key]!.assets ??= []
      clientManifest[key]!.assets?.push(...assetsToMove)
    }
    if (assetsToRemove.length) {
      const { key } = entryServer
      filesToRemove.push(...assetsToRemove)
      serverManifest[key]!.assets ??= []
      serverManifest[key]!.assets = serverManifest[key]!.assets!.filter((entry) => !assetsToRemove.includes(entry))
    }
  }

  // Also copy assets of virtual:@brillout/vite-plugin-server-entry:serverEntry
  {
    const filesClientAll: string[] = []
    for (const key in clientManifest) {
      const entry = clientManifest[key]!
      filesClientAll.push(entry.file)
      filesClientAll.push(...(entry.assets ?? []))
      filesClientAll.push(...(entry.css ?? []))
    }
    for (const key in serverManifest) {
      const entry = serverManifest[key]!
      if (!entry.isEntry) continue
      const resources = collectResources(entry, serverManifest)
      const css = resources.css.map((css) => css.src).filter((file) => !filesClientAll.includes(file))
      const assets = resources.assets.map((asset) => asset.src).filter((file) => !filesClientAll.includes(file))
      filesToMove.push(...css, ...assets)
      if (css.length > 0 || assets.length > 0) {
        assert(!clientManifest[key])
        clientManifest[key] = {
          ...entry,
          css,
          assets,
          dynamicImports: undefined,
          imports: undefined
        }
      }
    }
  }

  const clientManifestMod = clientManifest
  const serverManifestMod = serverManifest
  filesToMove = unique(filesToMove)
  filesToRemove = unique(filesToRemove).filter((file) => !filesToMove.includes(file))
  return { clientManifestMod, serverManifestMod, filesToMove, filesToRemove }
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

// Use the hash of resources to determine whether they are equal. We need this, otherwise we get:
// ```html
// <head>
//   <link rel="stylesheet" type="text/css" href="/assets/static/onRenderClient.2j6TxKIB.css">
//   <link rel="stylesheet" type="text/css" href="/assets/static/onRenderHtml.2j6TxKIB.css">
// </head>
// ```
function getHash(src: string) {
  // src is guarenteed to end with `.[hash][extname]`, see distFileNames.ts
  const hash = src.split('.').at(-2)
  assert(hash)
  return hash
}

// https://github.com/vikejs/vike/issues/1993
function fixServerAssets_assertUsageCssCodeSplit(config: ResolvedConfig) {
  assertWarning(
    config.build.cssCodeSplit,
    `${pc.cyan('build.cssCodeSplit')} shouldn't be set to ${pc.cyan(
      'false'
    )} (https://github.com/vikejs/vike/issues/1993)`,
    { onlyOnce: true }
  )
}

// https://github.com/vikejs/vike/issues/1815
type Target = undefined | false | string | string[]
type TargetConfig = { global: Exclude<Target, undefined>; css: Target; isServerSide: boolean }
const targets: TargetConfig[] = []
async function fixServerAssets_assertUsageCssTarget(config: ResolvedConfig) {
  if (!fixServerAssets_isEnabled()) return
  if (!(await isV1Design(config))) return
  const isServerSide = viteIsSSR(config)
  assert(typeof isServerSide === 'boolean')
  assert(config.build.target !== undefined)
  targets.push({ global: config.build.target, css: config.build.cssTarget, isServerSide })
  const targetsServer = targets.filter((t) => t.isServerSide)
  const targetsClient = targets.filter((t) => !t.isServerSide)
  targetsClient.forEach((targetClient) => {
    const targetCssResolvedClient = resolveCssTarget(targetClient)
    targetsServer.forEach((targetServer) => {
      const targetCssResolvedServer = resolveCssTarget(targetServer)
      assertWarning(
        isEqualStringList(targetCssResolvedClient, targetCssResolvedServer),
        [
          'The CSS browser target should be the same for both client and server, but we got:',
          `Client: ${pc.cyan(JSON.stringify(targetCssResolvedClient))}`,
          `Server: ${pc.cyan(JSON.stringify(targetCssResolvedServer))}`,
          `Different targets lead to CSS duplication, see ${pc.underline('https://github.com/vikejs/vike/issues/1815#issuecomment-2507002979')} for more information.`
        ].join('\n'),
        {
          showStackTrace: true,
          onlyOnce: 'different-css-target'
        }
      )
    })
  })
}
function resolveCssTarget(target: TargetConfig) {
  return target.css ?? target.global
}

/**
 * Recursively remove all empty directories in a given directory.
 */
function removeEmptyDirectories(dirPath: string): void {
  // Read the directory contents
  const files = fs_sync.readdirSync(dirPath)

  // Iterate through the files and subdirectories
  for (const file of files) {
    const fullPath = path.join(dirPath, file)

    // Check if it's a directory
    if (fs_sync.statSync(fullPath).isDirectory()) {
      // Recursively clean up the subdirectory
      removeEmptyDirectories(fullPath)
    }
  }

  // Re-check the directory; remove it if it's now empty
  if (fs_sync.readdirSync(dirPath).length === 0) {
    fs_sync.rmdirSync(dirPath)
  }
}
