export { previewConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { assertUsage, applyPreview } from '../utils.js'
import fs from 'fs'
import path from 'path'
import type { ViteDevServer } from 'vite'
import { addSsrMiddleware } from '../shared/addSsrMiddleware.js'
import pc from '@brillout/picocolors'
import { logDockerHint } from './devConfig/index.js'
import { getOutDirs, resolveOutDir } from '../shared/getOutDirs.js'
import sirv from 'sirv'
import { resolvePrerenderConfigGlobal } from '../../prerender/resolvePrerenderConfig.js'
type ConnectServer = ViteDevServer['middlewares']

function previewConfig(): Plugin {
  let config: ResolvedConfig
  // let vikeConfig: VikeConfigObject
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
      // vikeConfig = await getVikeConfig(config)
    },
    configurePreviewServer(server) {
      /* - Couldn't make `appType: 'mpa'` work as of npm:@brillout/vite@5.0.0-beta.14.0426910c
         - This ugly hack to set appType for preview won't be need once https://github.com/vitejs/vite/pull/14855 is merged.
      config.appType = 'mpa'
      */
      return () => {
        assertDist()

        // We cannot re-use Vite's static middleware: https://github.com/vitejs/vite/pull/14836#issuecomment-1788540300
        addStaticAssetsMiddleware(server.middlewares)

        const prerenderConfigGlobal = resolvePrerenderConfigGlobal(config._vikeConfigObject!)
        if (!prerenderConfigGlobal.isPrerenderingEnabledForAllPages) {
          addSsrMiddleware(server.middlewares, config, true, prerenderConfigGlobal.isPrerenderingEnabled)
        }

        addStatic404Middleware(server.middlewares)
      }
    }
  }
  function assertDist() {
    const { outDirRoot, outDirClient, outDirServer } = getOutDirs(config)
    ;[outDirRoot, outDirClient, outDirServer].forEach((outDirAny) => {
      assertUsage(
        fs.existsSync(outDirAny),
        `Cannot run ${pc.cyan('$ vike preview')}: your app isn't built (the build directory ${pc.cyan(
          outDirAny
        )} is missing). Make sure to run ${pc.cyan('$ vike build')} before running ${pc.cyan('$ vike preview')}.`
      )
    })
  }

  function addStaticAssetsMiddleware(middlewares: ConnectServer) {
    const { outDirClient } = getOutDirs(config)
    middlewares.use(sirv(outDirClient))
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
