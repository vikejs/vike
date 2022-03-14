export { chunkFileNames }

import { getRoot, assertPosixPath } from './utils'
import type { PreRenderedChunk } from 'rollup'
import type { Plugin, UserConfig } from 'vite'
import { posix } from 'path'
import { assert, isCallable } from '../utils'
import { determinePageId } from '../../shared/determinePageId'
import { getFilesystemRoute } from '../../shared/route/resolveFilesystemRoute'

function chunkFileNames(): Plugin {
  return {
    name: 'vite-plugin-ssr:chunkFileNames',
    apply: 'build',
    enforce: 'post',
    async configResolved(config) {
      const root = getRoot(config)
      overrideChunkFileNames(config, (chunkFileNames_original) => {
        return getChunkFileNames(root, chunkFileNames_original)
      })
    },
  }
}

type ChunkFileNames = string | ((chunkInfo: PreRenderedChunk) => string) | undefined

function getChunkFileNames(root: string, chunkFileNames_original: ChunkFileNames) {
  return (chunkInfo: PreRenderedChunk, ...rest: any[]) => {
    let chunkFileName: string | undefined =
      (typeof chunkFileNames_original === 'string' && chunkFileNames_original) ||
      (isCallable(chunkFileNames_original) && (chunkFileNames_original(chunkInfo, ...rest) as any)) ||
      undefined

    const id = chunkInfo.facadeModuleId

    if (id) {
      assertPosixPath(id)
    }
    assertPosixPath(root)
    if (!chunkInfo.isDynamicEntry || !id || id.includes('/node_modules/') || !id.startsWith(root)) {
      chunkFileName ||= 'assets/chunk-[hash].js'
      return chunkFileName
    }

    chunkFileName ||= 'assets/[name].[hash].js'

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

function overrideChunkFileNames(
  config: { build: UserConfig['build'] },
  getChunkFileNames: (chunkFileNames_original: ChunkFileNames) => ChunkFileNames,
): void {
  if (!config?.build?.rollupOptions?.output) {
    config.build ??= {}
    config.build.rollupOptions ??= {}
    config.build.rollupOptions.output = { chunkFileNames: getChunkFileNames(undefined) }
  } else if (!Array.isArray(config.build.rollupOptions.output)) {
    const chunkFileNames_original = config.build.rollupOptions.output.chunkFileNames
    config.build.rollupOptions.output.chunkFileNames = getChunkFileNames(chunkFileNames_original)
  } else {
    config.build.rollupOptions.output.map((output) => {
      const chunkFileNames_original = output.chunkFileNames
      output.chunkFileNames = getChunkFileNames(chunkFileNames_original)
    })
  }
}
