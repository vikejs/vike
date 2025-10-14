export { handleAssetsManifest }
export { handleAssetsManifest_getBuildConfig }
export { handleAssetsManifest_isFixEnabled }
export { handleAssetsManifest_assertUsageCssCodeSplit }
export { handleAssetsManifest_assertUsageCssTarget }
export { handleAssetsManifest_alignCssTarget_part2 }

import fs from 'node:fs/promises'
import fs_sync from 'node:fs'
import path from 'node:path'
import { existsSync } from 'node:fs'
import type { ViteManifest, ViteManifestEntry } from '../../../../types/ViteManifest.js'
import { assert, assertWarning, getGlobalObject, isEqualStringList, isObject, pLimit, unique } from '../../utils.js'
import { parseVirtualFileId } from '../../../shared/virtualFileId.js'
import type { Environment, ResolvedConfig, Rollup } from 'vite'
import { getAssetsDir } from '../../shared/getAssetsDir.js'
import pc from '@brillout/picocolors'
import { isV1Design } from '../../shared/resolveVikeConfigInternal.js'
import { getOutDirs } from '../../shared/getOutDirs.js'
import {
  isViteServerSide_onlySsrEnv,
  isViteServerSide,
  isViteServerSide_viteEnvOptional,
} from '../../shared/isViteServerSide.js'
import { set_macro_ASSETS_MANIFEST } from './pluginProdBuildEntry.js'
import { getManifestFilePathRelative } from '../../shared/getManifestFilePathRelative.js'
type Bundle = Rollup.OutputBundle

const globalObject = getGlobalObject('handleAssetsManifest.ts', {
  assetsJsonFilePath: undefined as string | undefined,
  targetsAll: [] as TargetConfig[],
  configsAll: [] as ResolvedConfig[],
})

// yes  => use workaround config.build.ssrEmitAssets
// false => use workaround extractAssets plugin
function handleAssetsManifest_isFixEnabled(): boolean {
  // Allow user to toggle between the two workarounds? E.g. based on https://vike.dev/includeAssetsImportedByServer.
  return isV1Design()
}

/** https://github.com/vikejs/vike/issues/1339 */
async function fixServerAssets(
  config: ResolvedConfig,
): Promise<{ clientManifestMod: ViteManifest; serverManifestMod: ViteManifest }> {
  const clientManifest = await readManifestFile(config, true)
  const serverManifest = await readManifestFile(config, false)

  const { clientManifestMod, serverManifestMod, filesToMove, filesToRemove } = addServerAssets(
    clientManifest,
    serverManifest,
  )
  await copyAssets(filesToMove, filesToRemove, config)

  return { clientManifestMod, serverManifestMod }
}
async function copyAssets(filesToMove: string[], filesToRemove: string[], config: ResolvedConfig) {
  const { outDirClient, outDirServer } = getOutDirs(config, undefined)
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
      }),
    ),
  )
  filesToRemove.forEach((file) => {
    const filePath = path.posix.join(outDirServer, file)
    fs_sync.unlinkSync(filePath)
  })
  /* We cannot do that because, with some edge case Rollup settings (outputting JavaScript chunks and static assets to the same directory), this removes JavaScript chunks, see https://github.com/vikejs/vike/issues/1154#issuecomment-1975762404
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
          imports: undefined,
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
  //   ../../virtual:vike:page-entry:client:/pages/index
  // to:
  //   virtual:vike:page-entry:client:/pages/index
  // (This seems to be needed only for vitest tests that use Vite's build() API with an inline config.)
  key = key.substring(key.indexOf('virtual:vike'))
  const result = parseVirtualFileId(key)
  return result && result.type === 'page-entry' ? result.pageId : null
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
  // src is guaranteed to end with `.[hash][extname]`, see pluginDistFileNames.ts
  const hash = src.split('.').at(-2)
  assert(hash)
  return hash
}

// https://github.com/vikejs/vike/issues/1993
function handleAssetsManifest_assertUsageCssCodeSplit(config: ResolvedConfig) {
  if (!handleAssetsManifest_isFixEnabled()) return
  assertWarning(
    config.build.cssCodeSplit,
    `${pc.cyan('build.cssCodeSplit')} shouldn't be set to ${pc.cyan(
      'false',
    )} (https://github.com/vikejs/vike/issues/1993)`,
    { onlyOnce: true },
  )
}

// https://github.com/vikejs/vike/issues/1815
// https://github.com/vitejs/vite/issues/20505
type CssTarget = ResolvedConfig['build']['cssTarget']
type Target = ResolvedConfig['build']['target'] | CssTarget
type TargetConfig = { global: Exclude<Target, undefined>; css: Target; isServerSide: boolean }
function handleAssetsManifest_alignCssTarget_part2(config: ResolvedConfig) {
  if (isViteServerSide_viteEnvOptional(config, undefined)) return
  const { cssTarget } = config.build
  assert(cssTarget)
  globalObject.configsAll.forEach((c) => (c.build.cssTarget = cssTarget))
  globalObject.configsAll.push(config)
}
function handleAssetsManifest_assertUsageCssTarget(config: ResolvedConfig, env: Environment) {
  if (!handleAssetsManifest_isFixEnabled()) return
  console.log('>>>> handleAssetsManifest_assertUsageCssCodeSplit()')
  const isServerSide = isViteServerSide(config, env)
  assert(typeof isServerSide === 'boolean')
  assert(config.build.target !== undefined)
  console.log('isServerSide', isServerSide)
  console.log('config.build.cssTarget', config.build.cssTarget)
  console.log('config.build.target', config.build.target)
  const { targetsAll } = globalObject
  targetsAll.push({ global: config.build.target, css: config.build.cssTarget, isServerSide })
  const targetsServer = targetsAll.filter((t) => t.isServerSide)
  const targetsClient = targetsAll.filter((t) => !t.isServerSide)
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
          `Different targets lead to CSS duplication, see ${pc.underline('https://github.com/vikejs/vike/issues/1815#issuecomment-2507002979')} for more information.`,
        ].join('\n'),
        {
          showStackTrace: true,
          onlyOnce: 'different-css-target',
        },
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

async function readManifestFile(config: ResolvedConfig, client: boolean) {
  const manifestFilePath = getManifestFilePath(config, client)
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

async function handleAssetsManifest_getBuildConfig() {
  const isFixEnabled = handleAssetsManifest_isFixEnabled()
  return {
    // https://github.com/vikejs/vike/issues/1339
    ssrEmitAssets: isFixEnabled ? true : undefined,
    // Required if `ssrEmitAssets: true`, see https://github.com/vitejs/vite/pull/11430#issuecomment-1454800934
    cssMinify: isFixEnabled ? 'esbuild' : undefined,
    manifest: true,
    /* Already set by vike:build:pluginBuildApp
    copyPublicDir: !isViteServerSide_viteEnvOptional(config),
    */
  } as const
}

async function handleAssetsManifest(
  config: ResolvedConfig,
  viteEnv: Environment,
  options: { dir: string | undefined },
  bundle: Bundle,
) {
  const isSsrEnv = isViteServerSide_onlySsrEnv(config, viteEnv)
  if (isSsrEnv) {
    const outDirs = getOutDirs(config, viteEnv)
    globalObject.assetsJsonFilePath = path.posix.join(outDirs.outDirRoot, 'assets.json')
    await writeAssetsManifestFile(globalObject.assetsJsonFilePath, config)
  }
  if (isViteServerSide(config, viteEnv)) {
    const outDir = options.dir
    assert(outDir)
    // Replace __VITE_ASSETS_MANIFEST__ in server builds
    // - Always replace it in dist/server/
    // - Also in some other server builds such as dist/vercel/ from vike-vercel
    // - Don't replace it in dist/rsc/ from vike-react-rsc since __VITE_ASSETS_MANIFEST__ doesn't exist there
    const noop = await set_macro_ASSETS_MANIFEST(globalObject.assetsJsonFilePath, bundle, outDir)
    if (isSsrEnv) assert(!noop) // dist/server should always contain __VITE_ASSETS_MANIFEST__
  }
}
async function writeAssetsManifestFile(assetsJsonFilePath: string, config: ResolvedConfig) {
  const isFixEnabled = handleAssetsManifest_isFixEnabled()
  const clientManifestFilePath = getManifestFilePath(config, true)
  const serverManifestFilePath = getManifestFilePath(config, false)
  if (!isFixEnabled) {
    await fs.copyFile(clientManifestFilePath, assetsJsonFilePath)
  } else {
    const { clientManifestMod } = await fixServerAssets(config)
    await writeManifestFile(clientManifestMod, assetsJsonFilePath)
  }
  await fs.rm(clientManifestFilePath)
  await fs.rm(serverManifestFilePath)
}

function getManifestFilePath(config: ResolvedConfig, client: boolean) {
  const outDirs = getOutDirs(config, undefined)
  const outDir = client ? outDirs.outDirClient : outDirs.outDirServer
  const env = client ? config.environments.client : config.environments.ssr
  assert(env)
  const manifestFilePathRelative = getManifestFilePathRelative(env.build.manifest)
  const manifestFilePath = path.posix.join(outDir, manifestFilePathRelative)
  return manifestFilePath
}
