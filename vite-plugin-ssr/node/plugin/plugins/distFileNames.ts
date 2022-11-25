export { distFileNames }

import { assertPosixPath, assert, assertUsage } from '../utils'
import type { Plugin, ResolvedConfig } from 'vite'
import path from 'path'
import { determinePageId } from '../../../shared/determinePageId'
import { deduceRouteStringFromFilesystemPath } from '../../../shared/route/deduceRouteStringFromFilesystemPath'
import { extractAssetsRE } from './extractAssetsPlugin'

function distFileNames(): Plugin {
  return {
    name: 'vite-plugin-ssr:distFileNames',
    apply: 'build',
    enforce: 'post',
    async configResolved(config) {
      const rollupOutput = getRollupOutput(config)
      if (!rollupOutput.entryFileNames) {
        if (!config.build.ssr) {
          const assetsDir = getAssetsDir(config)
          rollupOutput.entryFileNames = `${assetsDir}/[name].[hash].js`
        } else {
          // We let Vite set the name of server entries
        }
      }
      if (!rollupOutput.chunkFileNames) {
        rollupOutput.chunkFileNames = (chunkInfo) => getChunkFileName(chunkInfo, config)
      }
      if (!rollupOutput.assetFileNames) {
        rollupOutput.assetFileNames = (chunkInfo) => getAssetFileName(chunkInfo, config)
      }
    }
  }
}

const BLACK_LIST = ['assertRenderHook.css']
function getAssetFileName(assetInfo: PreRenderedAsset, config: ResolvedConfig): string {
  const assetsDir = getAssetsDir(config)

  // Not sure when/why this happens
  if (assetInfo.name && BLACK_LIST.includes(assetInfo.name)) {
    return `${assetsDir}/chunk-[hash][extname]`
  }

  // dist/client/assets/index.page.server.jsx_extractAssets_lang.e4e33422.css
  // => dist/client/assets/index.page.server.e4e33422.css
  if (
    // Vite 2
    assetInfo.name?.endsWith('_extractAssets_lang.css') ||
    // Vite 3
    assetInfo.name?.endsWith('?extractAssets&lang.css')
  ) {
    const nameBase = assetInfo.name.split('.').slice(0, -2).join('.')
    return `${assetsDir}/${nameBase}.[hash][extname]`
  }

  return `${assetsDir}/[name].[hash][extname]`
}

function getChunkFileName(chunkInfo: PreRenderedChunk, config: ResolvedConfig) {
  const { root } = config
  assertPosixPath(root)
  const assetsDir = getAssetsDir(config)

  const id = chunkInfo.facadeModuleId

  if (id) {
    assertPosixPath(id)
  }
  assertPosixPath(root)

  if (
    !chunkInfo.isDynamicEntry ||
    !id ||
    id.includes('/node_modules/') ||
    !id.startsWith(root) ||
    (id.includes('.page.server.') && extractAssetsRE.test(id))
  ) {
    return `${assetsDir}/chunk-[hash].js`
  }

  let { name } = chunkInfo
  if (name.startsWith('index.page.') || name === 'index.page') {
    const chunkName = deduceChunkNameFromFilesystemRouting(id, root)
    if (chunkName) {
      name = name.replace('index', chunkName)
      return `${assetsDir}/${name}.[hash].js`
    }
  }

  return `${assetsDir}/[name].[hash].js`
}

function getRollupOutput(config: ResolvedConfig) {
  // @ts-expect-error is read-only
  config.build ??= {}
  config.build.rollupOptions ??= {}
  config.build.rollupOptions.output ??= {}
  const { output } = config.build.rollupOptions
  assert(!Array.isArray(output)) // Do we need to support `output` being an `array`?
  return output
}

type Output = Extract<ResolvedConfig['build']['rollupOptions']['output'], { chunkFileNames?: unknown }>
type ChunkFileNames = Output['chunkFileNames']
type AssetFileNames = Output['assetFileNames']
type PreRenderedChunk = Parameters<Extract<ChunkFileNames, Function>>[0]
type PreRenderedAsset = Parameters<Extract<AssetFileNames, Function>>[0]

function getAssetsDir(config: ResolvedConfig) {
  let { assetsDir } = config.build
  assertUsage(assetsDir, `${assetsDir} cannot be an empty string`)
  assetsDir = assetsDir.split(/\/|\\/).filter(Boolean).join('/')
  return assetsDir
}

function deduceChunkNameFromFilesystemRouting(id: string, root: string): string | null {
  assert(id?.startsWith(root), { id, root })
  const pathRelative = path.posix.relative(root, id)
  assert(!pathRelative.startsWith('.') && !pathRelative.startsWith('/'), { id, root })
  const pageId = determinePageId('/' + pathRelative)
  const routeString = deduceRouteStringFromFilesystemPath(pageId, [])
  const dirS = routeString.split('/')
  const pageFileName = dirS[dirS.length - 1]
  return pageFileName ?? null
}
