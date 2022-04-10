export { previewConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { apply, addSsrMiddleware, assertPosixPath, assertUsage, getOutDirs } from '../utils'
import { getOutDir } from './buildConfig'
import { assertViteConfig } from './config/assertConfig'
import fs from 'fs'

function previewConfig(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'vite-plugin-ssr:previewConfig',
    apply: apply('preview'),
    config(config) {
      return {
        build: {
          outDir: getOutDir(config),
        },
      }
    },
    configResolved(config_) {
      config = config_
    },
    configurePreviewServer(server) {
      assertDist()
      assertViteConfig(config)
      if (!config.vitePluginSsr.prerender) {
        return addSsrMiddleware(server.middlewares)
      }
    },
  }
  function assertDist() {
    const {
      build: { outDir },
    } = config
    assertPosixPath(outDir)
    let { outDirRoot, outDirClient, outDirServer } = getOutDirs(outDir)
    if (!outDirRoot.endsWith('/')) outDirRoot = outDirRoot + '/'
    assertUsage(
      fs.existsSync(outDirClient) && fs.existsSync(outDirServer),
      `Cannot run \`$ vite preview\`: your app wasn't built yet (the build directory \`${outDirRoot}\` is missing). Make sure to run \`$ vite build\` before running \`$ vite preview\`.`,
    )
  }
}
