export { getViteConfigRuntime }
export type { ViteConfigRuntime }

import type { ResolvedConfig } from 'vite'
import { assert, assertFilePathAbsoluteFilesystem, hasProp } from '../utils.js'
import { getOutDirs } from './getOutDirs.js'

type ViteConfigRuntime = ReturnType<typeof getViteConfigRuntime>
function getViteConfigRuntime(config: ResolvedConfig) {
  assert(hasProp(config, '_baseViteOriginal', 'string'))
  const { outDirRoot } = getOutDirs(config, undefined)
  assertFilePathAbsoluteFilesystem(outDirRoot)
  const viteConfigRuntime = {
    root: config.root,
    build: {
      outDir: outDirRoot,
    },
    _baseViteOriginal: config._baseViteOriginal,
    vitePluginServerEntry: {
      inject: config.vitePluginServerEntry?.inject,
    },
  }
  return viteConfigRuntime
}
