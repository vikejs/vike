export { ssrEmitAssetsPlugin }

import type { Plugin } from 'vite'
import path from 'path'
import fs from 'fs/promises'
import { existsSync } from 'fs'
import { ViteManifestEntry } from '../../shared/ViteManifest.js'
import fg from 'fast-glob'
import { assert, getGlobalObject } from '../utils.js'
import { getGlobalContext } from '../../runtime/globalContext.js'

const globalObject = getGlobalObject('ssrEmitAssets.ts', {
  outDirServerAbs: '',
  outDirClientAbs: ''
})

function ssrEmitAssetsPlugin(): Plugin {
  return {
    name: 'vike:ssrEmitAssets',
    enforce: 'post',
    apply(config, env) {
      //@ts-expect-error Vite 5 || Vite 4
      return !!(env.isSsrBuild || env.ssrBuild)
    },
    config(config, env) {
      return {
        build: {}
      }
    },
    configResolved(config) {
      globalObject.outDirServerAbs = path.posix.join(config.root, config.build.outDir)
      globalObject.outDirClientAbs = path.posix.resolve(globalObject.outDirServerAbs, '..', 'client')
    },
    async closeBundle() {
      const assetsDirServerAbs = path.posix.join(globalObject.outDirServerAbs, 'assets')
      const assetsDirClientAbs = path.posix.join(globalObject.outDirClientAbs, 'assets')
      if (!existsSync(assetsDirServerAbs)) {
        return
      }
      //TODO: This can create duplicates
      await fs.cp(assetsDirServerAbs, assetsDirClientAbs, { recursive: true, force: true })
      await fs.rm(assetsDirServerAbs, { recursive: true })
    }
  }
}
