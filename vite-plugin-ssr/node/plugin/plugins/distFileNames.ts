export { distFileNames }

import { assertPosixPath, assert, isCallable, assertUsage } from '../utils'
import type { PreRenderedChunk, PreRenderedAsset } from 'rollup'
import type { Plugin, ResolvedConfig } from 'vite'
import path from 'path'
import { determinePageId } from '../../../shared/determinePageId'
import { getFilesystemRoute } from '../../../shared/route/resolveFilesystemRoute'
import { extractStylesRE } from './extractStylesPlugin'

function distFileNames(): Plugin {
  return {
    name: 'vite-plugin-ssr:distFileNames',
    apply: 'build',
    enforce: 'post',
    async configResolved(config) {
      setChunkFileNames(config, getChunkFileName)
      setAssetFileNames(config, getAssetFileName)
    },
  }
}

type ChunkFileNames = string | ((chunkInfo: PreRenderedChunk) => string) | undefined
type AssetFileNames = string | ((chunkInfo: PreRenderedAsset) => string) | undefined

const BLACK_LIST = ['assertRenderHook.css']
function getAssetFileName(
  assetInfo: PreRenderedAsset,
  assetFileName: string | undefined,
  config: ResolvedConfig,
): string {
  const assetsDir = getAssetsDir(config)

  // Not sure when/why this happens
  if (assetInfo.name && BLACK_LIST.includes(assetInfo.name)) {
    assetFileName ??= `${assetsDir}/chunk-[hash][extname]`
  }

  // dist/client/assets/index.page.server.jsx_extractStyles_lang.e4e33422.css
  // => dist/client/assets/index.page.server.e4e33422.css
  if (
    // Vite 2
    assetInfo.name?.endsWith('_extractStyles_lang.css') ||
    // Vite 3
    assetInfo.name?.endsWith('?extractStyles&lang.css')
  ) {
    const nameBase = assetInfo.name.split('.').slice(0, -2).join('.')
    assetFileName ??= `${assetsDir}/${nameBase}.[hash][extname]`
  }

  assetFileName ??= `${assetsDir}/[name].[hash][extname]`
  return assetFileName
}

function getChunkFileName(chunkInfo: PreRenderedChunk, chunkFileName: string | undefined, config: ResolvedConfig) {
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
    (id.includes('.page.server.') && extractStylesRE.test(id))
  ) {
    chunkFileName ??= `${assetsDir}/chunk-[hash].js`
    return chunkFileName
  }

  chunkFileName ??= `${assetsDir}/[name].[hash].js`

  const { name } = chunkInfo
  if (name.startsWith('index.page.') || name === 'index.page') {
    const chunkName = deduceChunkNameFromFilesystemRouting(id, root)
    if (chunkName) {
      chunkFileName = chunkFileName.replace('[name]', name.replace('index', chunkName))
      return chunkFileName
    }
  }
  return chunkFileName
}

function deduceChunkNameFromFilesystemRouting(id: string, root: string): string | null {
  assert(id?.startsWith(root), { id, root })
  const pathRelative = path.posix.relative(root, id)
  assert(!pathRelative.startsWith('.') && !pathRelative.startsWith('/'), { id, root })
  const pageId = determinePageId('/' + pathRelative)
  const filesystemRoute = getFilesystemRoute(pageId, [])
  const dirS = filesystemRoute.split('/')
  const pageFileName = dirS[dirS.length - 1]
  return pageFileName ?? null
}

function setChunkFileNames(
  config: ResolvedConfig,
  getChunkFileName: (chunkInfo: PreRenderedChunk, chunkFileName: string | undefined, config: ResolvedConfig) => string,
): void {
  if (!config?.build?.rollupOptions?.output) {
    // @ts-expect-error `ResolvedConfig['build']` is `readonly`
    config.build ??= {}
    config.build.rollupOptions ??= {}
    config.build.rollupOptions.output = {
      chunkFileNames: (chunkInfo: PreRenderedChunk) => getChunkFileName(chunkInfo, undefined, config),
    }
  } else if (!Array.isArray(config.build.rollupOptions.output)) {
    const chunkFileNames_original = config.build.rollupOptions.output.chunkFileNames
    config.build.rollupOptions.output.chunkFileNames = (chunkInfo: PreRenderedChunk) =>
      getChunkFileName(chunkInfo, resolveChunkFileNames(chunkFileNames_original, chunkInfo), config)
  } else {
    config.build.rollupOptions.output.map((output) => {
      const chunkFileNames_original = output.chunkFileNames
      output.chunkFileNames = (chunkInfo: PreRenderedChunk) =>
        getChunkFileName(chunkInfo, resolveChunkFileNames(chunkFileNames_original, chunkInfo), config)
    })
  }
}
function setAssetFileNames(
  config: ResolvedConfig,
  getAssetFileName: (chunkInfo: PreRenderedAsset, chunkFileName: string | undefined, config: ResolvedConfig) => string,
): void {
  if (!config?.build?.rollupOptions?.output) {
    // @ts-expect-error `ResolvedConfig['build']` is `readonly`
    config.build ??= {}
    config.build.rollupOptions ??= {}
    config.build.rollupOptions.output = {
      assetFileNames: (chunkInfo: PreRenderedAsset) => getAssetFileName(chunkInfo, undefined, config),
    }
  } else if (!Array.isArray(config.build.rollupOptions.output)) {
    const chunkFileNames_original = config.build.rollupOptions.output.assetFileNames
    config.build.rollupOptions.output.assetFileNames = (chunkInfo: PreRenderedAsset) =>
      getAssetFileName(chunkInfo, resolveAssetFileNames(chunkFileNames_original, chunkInfo), config)
  } else {
    config.build.rollupOptions.output.map((output) => {
      const chunkFileNames_original = output.assetFileNames
      output.assetFileNames = (chunkInfo: PreRenderedAsset) =>
        getAssetFileName(chunkInfo, resolveAssetFileNames(chunkFileNames_original, chunkInfo), config)
    })
  }
}

function resolveChunkFileNames(chunkFileNames: ChunkFileNames, chunkInfo: PreRenderedChunk): string | undefined {
  if (!chunkFileNames) {
    return undefined
  }
  if (typeof chunkFileNames === 'string') {
    return chunkFileNames
  }
  if (isCallable(chunkFileNames)) {
    const chunkFileName = chunkFileNames(chunkInfo)
    assert(typeof chunkFileName === 'string')
    return chunkFileName
  }
  assert(false)
}

function resolveAssetFileNames(chunkFileNames: AssetFileNames, chunkInfo: PreRenderedAsset): string | undefined {
  if (!chunkFileNames) {
    return undefined
  }
  if (typeof chunkFileNames === 'string') {
    return chunkFileNames
  }
  if (isCallable(chunkFileNames)) {
    const chunkFileName = chunkFileNames(chunkInfo)
    assert(typeof chunkFileName === 'string')
    return chunkFileName
  }
  assert(false)
}

function getAssetsDir(config: ResolvedConfig) {
  let { assetsDir } = config.build
  assertUsage(assetsDir, `${assetsDir} cannot be an empty string`)
  assetsDir = assetsDir.split(/\/|\\/).filter(Boolean).join('/')
  return assetsDir
}
