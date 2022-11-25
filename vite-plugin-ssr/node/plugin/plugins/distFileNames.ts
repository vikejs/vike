export { distFileNames }

import { assertPosixPath, assert, isCallable, assertUsage } from '../utils'
import type { Plugin, ResolvedConfig } from 'vite'
import path from 'path'
import { determinePageId } from '../../../shared/determinePageId'
import { extractAssetsRE } from './extractAssetsPlugin'

function distFileNames(): Plugin {
  return {
    name: 'vite-plugin-ssr:distFileNames',
    apply: 'build',
    enforce: 'post',
    async configResolved(config) {
      setChunkFileNames(config, getChunkFileName)
      setAssetFileNames(config, getAssetFileName)
    }
  }
}

type Output = ResolvedConfig['build']['rollupOptions']['output']
type ChunkFileNames = Extract<Output, { chunkFileNames?: unknown }>['chunkFileNames']
type AssetFileNames = Extract<Output, { assetFileNames?: unknown }>['assetFileNames']
type PreRenderedChunk = Parameters<Extract<ChunkFileNames, Function>>[0]
type PreRenderedAsset = Parameters<Extract<AssetFileNames, Function>>[0]

const BLACK_LIST = ['assertRenderHook.css']
function getAssetFileName(
  assetInfo: PreRenderedAsset,
  assetFileName: string | undefined,
  config: ResolvedConfig
): string {
  console.log('a1', assetInfo.name)
  if (assetFileName) return assetFileName

  const nameOriginal = assetInfo.name
  const assetsDir = getAssetsDir(config)
  if( !nameOriginal ) return `${assetsDir}/[name]-[hash][extname]`
  const { name, ext } = getExtAsset(nameOriginal)

  // Not sure when/why this happens
  if (BLACK_LIST.includes(name)) {
    assetFileName = `${assetsDir}/chunk-[hash]${ext}`
    console.log('a2', assetFileName)
    return assetFileName
  }

  // dist/client/assets/index.page.server.jsx_extractAssets_lang.e4e33422.css
  // => dist/client/assets/index.page.server.e4e33422.css
  if (
    // Vite 2
    name.endsWith('_extractAssets_lang.css') ||
    // Vite 3
    name.endsWith('?extractAssets&lang.css')
  ) {
    // TODO
    //const nameBase = name.split('.').slice(0, -2).join('.')
    assetFileName = `${assetsDir}/${name}-[hash]${ext}`
    console.log('a3', assetFileName)
    return assetFileName
  }

  assetFileName = `${assetsDir}/${name}-[hash]${ext}`
  console.log('a4', assetFileName)
  return assetFileName
}

function getChunkFileName(chunkInfo: PreRenderedChunk, chunkFileName: string | undefined, config: ResolvedConfig) {
  console.log('c1', chunkInfo.facadeModuleId)
  if (chunkFileName) return chunkFileName

  const { root } = config
  assertPosixPath(root)
  const assetsDir = getAssetsDir(config)

  const { facadeModuleId: id } = chunkInfo

  if (id) {
    assertPosixPath(id)
  }
  assertPosixPath(root)

  if (
    !chunkInfo.isDynamicEntry ||
    !id ||
    id.includes('/node_modules/') ||
    !id.startsWith(root) ||
    extractAssetsRE.test(id)
  ) {
    chunkFileName = `${assetsDir}/chunk-[hash].js`
    console.log('c2', chunkFileName)
    return chunkFileName
  }

  const { ext, name } = getExtChunk(chunkInfo.name)

  if (id.includes('.page.')) {
    const chunkPath = deduceChunkPath(id, root)
    chunkFileName = [assetsDir, chunkPath, `${name}-[hash].${ext}`].filter(Boolean).join('/')
    console.log('c3', chunkFileName)
    return chunkFileName
  }

  chunkFileName = `${assetsDir}/${name}-[hash].${ext}`
  console.log('c4', chunkFileName)
  return chunkFileName
}

function getExtChunk(nameOriginal: string): { name: string, ext: string } {
  const [name, ...exts] = nameOriginal.split('.')
  assert(name)
  // "[extname]" is not a valid placeholder in the "output.chunkFileNames" pattern.
  const ext = [...exts, 'js'].join('.')
  return { name, ext }
}
function getExtAsset(nameOriginal: string): { name: string, ext: string } {
  const [name, ...exts] = nameOriginal.split('.')
  assert(name)
  const ext = ['', ...exts].join('.')
  return { name, ext }
}

function deduceChunkPath(id: string, root: string): string {
  assert(id?.startsWith(root), { id, root })
  const pathRelative = path.posix.relative(root, id)
  assert(!pathRelative.startsWith('.') && !pathRelative.startsWith('/'), { id, root })
  const pageId = determinePageId('/' + pathRelative)
  assert(!pageId.endsWith('.'), id)
  assert(!pageId.endsWith('.page'), id)
  let chunkPath = pageId
    .split('/')
  // Remove file name
    .slice(0, -1)
    .join('/')
  assert(chunkPath.startsWith('/') || chunkPath==='')
  chunkPath = chunkPath.slice(1)
  assert(!chunkPath.startsWith('/'))
  assert(!chunkPath.endsWith('/'))
  return chunkPath
}

function setChunkFileNames(
  config: ResolvedConfig,
  getChunkFileName: (chunkInfo: PreRenderedChunk, chunkFileName: string | undefined, config: ResolvedConfig) => string
): void {
  if (!config?.build?.rollupOptions?.output) {
    // @ts-expect-error `ResolvedConfig['build']` is `readonly`
    config.build ??= {}
    config.build.rollupOptions ??= {}
    config.build.rollupOptions.output = {
      chunkFileNames: (chunkInfo: PreRenderedChunk) => getChunkFileName(chunkInfo, undefined, config)
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
  getAssetFileName: (chunkInfo: PreRenderedAsset, chunkFileName: string | undefined, config: ResolvedConfig) => string
): void {
  if (!config?.build?.rollupOptions?.output) {
    // @ts-expect-error `ResolvedConfig['build']` is `readonly`
    config.build ??= {}
    config.build.rollupOptions ??= {}
    config.build.rollupOptions.output = {
      assetFileNames: (chunkInfo: PreRenderedAsset) => getAssetFileName(chunkInfo, undefined, config)
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
