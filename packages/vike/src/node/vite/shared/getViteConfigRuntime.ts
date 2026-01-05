import '../assertEnvVite.js'

export { getViteConfigRuntime }
export type { ViteConfigRuntime }

import type { ResolvedConfig } from 'vite'
import { assertFilePathAbsoluteFilesystem } from '../../../utils/isFilePathAbsoluteFilesystem.js'
import { assert } from '../../../utils/assert.js'
import { hasProp } from '../../../utils/hasProp.js'
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
