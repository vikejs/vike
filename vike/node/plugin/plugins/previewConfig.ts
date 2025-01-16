export { previewConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { assertUsage, getOutDirs, resolveOutDir, applyPreview } from '../utils.js'
import fs from 'fs'
import path from 'path'
import type { ViteDevServer } from 'vite'
import { addSsrMiddleware } from '../shared/addSsrMiddleware.js'
import pc from '@brillout/picocolors'
import { logDockerHint } from './devConfig/index.js'
type ConnectServer = ViteDevServer['middlewares']

function previewConfig(): Plugin {
  let config: ResolvedConfig
  // let configVike: VikeConfigGlobal
  return {
    name: 'vike:previewConfig',
    apply: applyPreview,
    config(config) {
      return {
        appType: 'custom',
        build: {
          outDir: resolveOutDir(config)
        }
      }
    },
    async configResolved(config_) {
      config = config_
      logDockerHint(config.preview.host)
      // const vikeConfig = await getVikeConfig(config)
      // configVike = vikeConfig.vikeConfigGlobal
    },
    configurePreviewServer(server) {
      /* - Couldn't make `appType: 'mpa'` work as of npm:@brillout/vite@5.0.0-beta.14.0426910c
         - This ugly hack to set appType for preview won't be need once https://github.com/vitejs/vite/pull/14855 is merged.
      config.appType = 'mpa'
      */
      return () => {
        assertDist()

        /* We don't use this condition (we wrongfully always use the SSR middleware) because of the regression introduced by https://github.com/vitejs/vite/pull/14756 which stops servering .html files when `appType: 'custom'`.
        if (!configVike.prerender || configVike.prerender.partial) {
          addSsrMiddleware(server.middlewares, config, true)
        }
        /*/
        addSsrMiddleware(server.middlewares, config, true)
        //*/

        addStatic404Middleware(server.middlewares)
      }
    }
  }
  function assertDist() {
    let { outDirRoot, outDirClient, outDirServer } = getOutDirs(config)
    ;[outDirRoot, outDirClient, outDirServer].forEach((outDirAny) => {
      assertUsage(
        fs.existsSync(outDirAny),
        `Cannot run ${pc.cyan('$ vike preview')}: your app isn't built (the build directory ${pc.cyan(
          outDirAny
        )} is missing). Make sure to run ${pc.cyan('$ vike build')} before running ${pc.cyan('$ vike preview')}.`
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
