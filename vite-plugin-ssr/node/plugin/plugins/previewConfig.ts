export { previewConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { assertPosixPath, assertUsage, getOutDirs, getOutDir } from '../utils'
import { apply, addSsrMiddleware } from '../helpers'
import { assertConfigVpsResolved } from './config/assertConfigVps'
import fs from 'fs'
import path from 'path'
import type { ViteDevServer } from 'vite'
type ConnectServer = ViteDevServer['middlewares']

function previewConfig(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'vite-plugin-ssr:previewConfig',
    apply: apply('preview'),
    config(config) {
      return {
        build: {
          outDir: getOutDir(config)
        }
      }
    },
    configResolved(config_) {
      config = config_
    },
    configurePreviewServer(server) {
      return () => {
        assertDist()
        assertConfigVpsResolved(config)
        if (!config.vitePluginSsr.prerender) {
          addSsrMiddleware(server.middlewares)
        }
        addStatic404Middleware(server.middlewares)
      }
    }
  }
  function assertDist() {
    const {
      build: { outDir }
    } = config
    assertPosixPath(outDir)
    let { outDirRoot, outDirClient, outDirServer } = getOutDirs(outDir)
    assertPosixPath(outDirRoot)
    if (!outDirRoot.endsWith('/')) outDirRoot = outDirRoot + '/'
    assertUsage(
      fs.existsSync(outDirClient) && fs.existsSync(outDirServer),
      `Cannot run \`$ vite preview\`: your app wasn't built yet (the build directory \`${outDirRoot}\` is missing). Make sure to run \`$ vite build\` before running \`$ vite preview\`.`
    )
  }

  function addStatic404Middleware(middlewares: ConnectServer) {
    const {
      build: { outDir }
    } = config
    const { outDirClient } = getOutDirs(outDir)
    middlewares.use(config.base, (_, res, next) => {
      const file = path.join(outDirClient, './404.html')
      if (fs.existsSync(file)) {
        res.statusCode = 404
        res.end(fs.readFileSync(file))
      } else {
        next()
      }
    })
  }
}
