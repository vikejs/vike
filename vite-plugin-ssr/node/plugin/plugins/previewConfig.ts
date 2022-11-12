export { previewConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { assertUsage, getOutDirs, determineOutDir } from '../utils'
import { apply, addSsrMiddleware } from '../helpers'
import { getConfigVps } from './config/assertConfigVps'
import fs from 'fs'
import path from 'path'
import type { ViteDevServer } from 'vite'
import { ConfigVpsResolved } from './config/ConfigVps'
type ConnectServer = ViteDevServer['middlewares']

function previewConfig(): Plugin {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
  return {
    name: 'vite-plugin-ssr:previewConfig',
    apply: apply('preview'),
    config(config) {
      return {
        build: {
          outDir: determineOutDir(config)
        }
      }
    },
    async configResolved(config_) {
      config = config_
      configVps = await getConfigVps(config)
    },
    configurePreviewServer(server) {
      return () => {
        assertDist()
        if (!configVps.prerender) {
          addSsrMiddleware(server.middlewares)
        }
        addStatic404Middleware(server.middlewares)
      }
    }
  }
  function assertDist() {
    let { outDirRoot, outDirClient, outDirServer } = getOutDirs(config)
    ;[outDirRoot, outDirClient, outDirServer].forEach((outDirAny) => {
      assertUsage(
        fs.existsSync(outDirAny),
        `Cannot run \`$ vite preview\`: your app isn't built (the build directory ${outDirAny} is missing). Make sure to run \`$ vite build\` before running \`$ vite preview\`.`
      )
    })
  }

  function addStatic404Middleware(middlewares: ConnectServer) {
    const { outDirClient } = getOutDirs(config)
    middlewares.use(config.base, (_, res, next) => {
      const file = path.posix.join(outDirClient, './404.html')
      if (fs.existsSync(file)) {
        res.statusCode = 404
        res.end(fs.readFileSync(file))
      } else {
        next()
      }
    })
  }
}
