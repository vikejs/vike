export { distFileNames }

import { getRoot, assertPosixPath } from './utils'
import type { PreRenderedChunk, PreRenderedAsset } from 'rollup'
import type { Plugin, UserConfig } from 'vite'
import { posix } from 'path'
import { assert, isCallable } from '../utils'
import { determinePageId } from '../../shared/determinePageId'
import { getFilesystemRoute } from '../../shared/route/resolveFilesystemRoute'

function distFileNames(): Plugin {
  return {
    name: 'vite-plugin-ssr:distFileNames',
    apply: 'build',
    enforce: 'post',
    async configResolved(config) {
      const root = getRoot(config)
      setChunkFileNames(config, root, getChunkFileName)
      setAssetFileNames(config, getAssetFileName)
    },
  }
}

type ChunkFileNames = string | ((chunkInfo: PreRenderedChunk) => string) | undefined
type AssetFileNames = string | ((chunkInfo: PreRenderedAsset) => string) | undefined

// Not sure why Rollup bundles the CSS of dynamic imports; is this a Rollup bug?
const BLACK_LIST = ['assertRenderHook.css']
function getAssetFileName(assetInfo: PreRenderedAsset, assetFileName: string | undefined): string {
  if (assetInfo.name && BLACK_LIST.includes(assetInfo.name)) {
    assetFileName ??= 'assets/chunk-[hash][extname]'
  }
  assetFileName ??= 'assets/[name].[hash][extname]'
  return assetFileName
}

function getChunkFileName(root: string, chunkInfo: PreRenderedChunk, chunkFileName: string | undefined) {
  const id = chunkInfo.facadeModuleId

  if (id) {
    assertPosixPath(id)
  }
  assertPosixPath(root)
  if (!chunkInfo.isDynamicEntry || !id || id.includes('/node_modules/') || !id.startsWith(root)) {
    chunkFileName ??= 'assets/chunk-[hash].js'
    return chunkFileName
  }

  chunkFileName ??= 'assets/[name].[hash].js'

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
  const pathRelative = posix.relative(root, id)
  assert(!pathRelative.startsWith('.') && !pathRelative.startsWith('/'), { id, root })
  const pageId = determinePageId('/' + pathRelative)
  const filesystemRoute = getFilesystemRoute(pageId, [])
  const dirS = filesystemRoute.split('/')
  const pageFileName = dirS[dirS.length - 1]
  return pageFileName ?? null
}

function setChunkFileNames(
  config: { build: UserConfig['build'] },
  root: string,
  getChunkFileName: (root: string, chunkInfo: PreRenderedChunk, chunkFileName: string | undefined) => string,
): void {
  if (!config?.build?.rollupOptions?.output) {
    config.build ??= {}
    config.build.rollupOptions ??= {}
    config.build.rollupOptions.output = {
      chunkFileNames: (chunkInfo: PreRenderedChunk) => getChunkFileName(root, chunkInfo, undefined),
    }
  } else if (!Array.isArray(config.build.rollupOptions.output)) {
    const chunkFileNames_original = config.build.rollupOptions.output.chunkFileNames
    config.build.rollupOptions.output.chunkFileNames = (chunkInfo: PreRenderedChunk) =>
      getChunkFileName(root, chunkInfo, resolveChunkFileNames(chunkFileNames_original, chunkInfo))
  } else {
    config.build.rollupOptions.output.map((output) => {
      const chunkFileNames_original = output.chunkFileNames
      output.chunkFileNames = (chunkInfo: PreRenderedChunk) =>
        getChunkFileName(root, chunkInfo, resolveChunkFileNames(chunkFileNames_original, chunkInfo))
    })
  }
}
function setAssetFileNames(
  config: { build: UserConfig['build'] },
  getAssetFileName: (chunkInfo: PreRenderedAsset, chunkFileName: string | undefined) => string,
): void {
  if (!config?.build?.rollupOptions?.output) {
    config.build ??= {}
    config.build.rollupOptions ??= {}
    config.build.rollupOptions.output = {
      assetFileNames: (chunkInfo: PreRenderedAsset) => getAssetFileName(chunkInfo, undefined),
    }
  } else if (!Array.isArray(config.build.rollupOptions.output)) {
    const chunkFileNames_original = config.build.rollupOptions.output.assetFileNames
    config.build.rollupOptions.output.assetFileNames = (chunkInfo: PreRenderedAsset) =>
      getAssetFileName(chunkInfo, resolveAssetFileNames(chunkFileNames_original, chunkInfo))
  } else {
    config.build.rollupOptions.output.map((output) => {
      const chunkFileNames_original = output.assetFileNames
      output.assetFileNames = (chunkInfo: PreRenderedAsset) =>
        getAssetFileName(chunkInfo, resolveAssetFileNames(chunkFileNames_original, chunkInfo))
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
