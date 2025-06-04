export { handleAssetsManifest }
export { handleAssetsManifest_getBuildConfig }
export { handleAssetsManifest_isFixEnabled }
export { handleAssetsManifest_assertUsageCssCodeSplit }
export { handleAssetsManifest_assertUsageCssTarget }

import fs from 'fs/promises'
import fs_sync from 'fs'
import path from 'path'
import { existsSync } from 'fs'
import type { ViteManifest, ViteManifestEntry } from '../../../../types/ViteManifest.js'
import {
  assert,
  assertIsSingleModuleInstance,
  assertWarning,
  isEqualStringList,
  isObject,
  pLimit,
  unique
} from '../../utils.js'
import { isVirtualFileIdPageConfigLazy } from '../../../shared/virtualFiles/virtualFilePageConfigLazy.js'
import { manifestTempFile } from './pluginBuildConfig.js'
import type { Environment, ResolvedConfig, Rollup, UserConfig } from 'vite'
import { getAssetsDir } from '../../shared/getAssetsDir.js'
import pc from '@brillout/picocolors'
import { getVikeConfigInternal, isV1Design } from '../../shared/resolveVikeConfig.js'
import { getOutDirs, OutDirs } from '../../shared/getOutDirs.js'
import { isViteServerBuild_onlySsrEnv, isViteServerBuild } from '../../shared/isViteServerBuild.js'
import { set_macro_ASSETS_MANIFEST } from './pluginBuildEntry.js'
type Bundle = Rollup.OutputBundle
type Options = Rollup.NormalizedOutputOptions
assertIsSingleModuleInstance('build/handleAssetsManifest.ts')
let assetsJsonFilePath: string | undefined

// true  => use workaround config.build.ssrEmitAssets
// false => use workaround extractAssets plugin
function handleAssetsManifest_isFixEnabled(config: ResolvedConfig | UserConfig): boolean {
  // Allow user to toggle between the two workarounds? E.g. based on https://vike.dev/includeAssetsImportedByServer.
  return isV1Design()
}

/** https://github.com/vikejs/vike/issues/1339 */
async function fixServerAssets(
  config: ResolvedConfig
): Promise<{ clientManifestMod: ViteManifest; serverManifestMod: ViteManifest }> {
  const outDirs = getOutDirs(config)
  const clientManifest = await readManifestFile(outDirs.outDirClient)
  const serverManifest = await readManifestFile(outDirs.outDirServer)

  const { clientManifestMod, serverManifestMod, filesToMove, filesToRemove } = addServerAssets(
    clientManifest,
    serverManifest
  )
  await copyAssets(filesToMove, filesToRemove, config)

  return { clientManifestMod, serverManifestMod }
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
  //   ../../virtual:vike:pageConfigLazy:client:/pages/index
  // to:
  //   virtual:vike:pageConfigLazy:client:/pages/index
  // (This seems to be needed only for vitest tests that use Vite's build() API with an inline config.)
  key = key.substring(key.indexOf('virtual:vike'))
  const result = isVirtualFileIdPageConfigLazy(key)
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
  // src is guarenteed to end with `.[hash][extname]`, see pluginDistFileNames.ts
  const hash = src.split('.').at(-2)
  assert(hash)
  return hash
}

// https://github.com/vikejs/vike/issues/1993
function handleAssetsManifest_assertUsageCssCodeSplit(config: ResolvedConfig) {
  if (!handleAssetsManifest_isFixEnabled(config)) return
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
function handleAssetsManifest_assertUsageCssTarget(config: ResolvedConfig) {
  if (!handleAssetsManifest_isFixEnabled(config)) return
  const isServerSide = isViteServerBuild(config)
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

async function readManifestFile(outDir: string) {
  const manifestFilePath = path.posix.join(outDir, manifestTempFile)
  const manifestFileContent = await fs.readFile(manifestFilePath, 'utf-8')
  assert(manifestFileContent)
  const manifest: unknown = JSON.parse(manifestFileContent)
  assert(manifest)
  assert(isObject(manifest))
  return manifest as ViteManifest
}
async function writeManifestFile(manifest: ViteManifest, manifestFilePath: string) {
  assert(isObject(manifest))
  const manifestFileContent = JSON.stringify(manifest, null, 2)
  await fs.writeFile(manifestFilePath, manifestFileContent, 'utf-8')
}

async function handleAssetsManifest_getBuildConfig(config: UserConfig) {
  const vikeConfig = await getVikeConfigInternal()
  const isFixEnabled = handleAssetsManifest_isFixEnabled(config)
  return {
    // https://github.com/vikejs/vike/issues/1339
    ssrEmitAssets: isFixEnabled ? true : undefined,
    // Required if `ssrEmitAssets: true`, see https://github.com/vitejs/vite/pull/11430#issuecomment-1454800934
    cssMinify: isFixEnabled ? 'esbuild' : undefined,
    manifest: manifestTempFile,
    copyPublicDir: vikeConfig.config.vite6BuilderApp
      ? // Already set by vike:build:pluginBuildApp
        undefined
      : !isViteServerBuild(config)
  } as const
}

async function handleAssetsManifest(
  config: ResolvedConfig,
  viteEnv: Environment | undefined,
  options: Options,
  bundle: Bundle
) {
  const isSsREnv = isViteServerBuild_onlySsrEnv(config, viteEnv)
  if (isSsREnv) {
    assert(!assetsJsonFilePath)
    const outDirs = getOutDirs(config, viteEnv)
    assetsJsonFilePath = path.posix.join(outDirs.outDirRoot, 'assets.json')
    await writeAssetsManifestFile(outDirs, assetsJsonFilePath, config)
  }
  if (isViteServerBuild(config, viteEnv)) {
    // Replace __VITE_ASSETS_MANIFEST__ in server builds
    // - Always replace it in dist/server/
    // - Also in some other server builds such as dist/vercel/ from vike-vercel
    // - Don't replace it in dist/rsc/ from vike-react-rsc since __VITE_ASSETS_MANIFEST__ doesn't exist there
    const noop = await set_macro_ASSETS_MANIFEST(options, bundle, assetsJsonFilePath)
    if (isSsREnv) assert(!noop) // dist/server should always contain __VITE_ASSETS_MANIFEST__
  }
}
async function writeAssetsManifestFile(outDirs: OutDirs, assetsJsonFilePath: string, config: ResolvedConfig) {
  const isFixEnabled = handleAssetsManifest_isFixEnabled(config)
  const clientManifestFilePath = path.posix.join(outDirs.outDirClient, manifestTempFile)
  const serverManifestFilePath = path.posix.join(outDirs.outDirServer, manifestTempFile)
  if (!isFixEnabled) {
    await fs.copyFile(clientManifestFilePath, assetsJsonFilePath)
  } else {
    const { clientManifestMod } = await fixServerAssets(config)
    await writeManifestFile(clientManifestMod, assetsJsonFilePath)
  }
  await fs.rm(clientManifestFilePath)
  await fs.rm(serverManifestFilePath)
}
