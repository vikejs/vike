export { pluginDev }
export { logDockerHint }

import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
import { determineOptimizeDeps } from './pluginDev/determineOptimizeDeps.js'
import { determineFsAllowList } from './pluginDev/determineFsAllowList.js'
import { addSsrMiddleware } from '../shared/addSsrMiddleware.js'
import { applyDev, assertWarning, isDocker } from '../utils.js'
import { improveViteLogs } from '../shared/loggerVite.js'
import { isErrorDebug } from '../../shared/isErrorDebug.js'
import { installHttpRequestAsyncStore } from '../shared/getHttpRequestAsyncStore.js'
import pc from '@brillout/picocolors'

if (isErrorDebug()) {
  Error.stackTraceLimit = Infinity
}

function pluginDev(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vike:pluginDev',
      apply: applyDev,
      config: {
        handler() {
          return {
            appType: 'custom',
            // TO-DO/next-major-release: remove (AFAICT we only need to use config.optimizeDeps for the old design)
            optimizeDeps: {
              exclude: ['vike'],
            },
          } satisfies UserConfig
        },
      },
      configResolved: {
        async handler(config_) {
          config = config_
          await determineOptimizeDeps(config)
          await determineFsAllowList(config)
          if (!isErrorDebug()) {
            await installHttpRequestAsyncStore()
            improveViteLogs(config)
          }
          logDockerHint(config.server.host)
        },
      },
    },
    {
      name: 'vike:pluginDev:addSsrMiddleware',
      apply: applyDev,
      // The SSR middleware should be last middleware
      enforce: 'post',
      configureServer: {
        order: 'post',
        handler(server) {
          const hasHonoViteDevServer = !!config.plugins.find((p) => p.name === '@hono/vite-dev-server')
          if (config.server.middlewareMode || hasHonoViteDevServer) return
          return () => {
            addSsrMiddleware(server.middlewares, config, false, null)
          }
        },
      },
      // Setting `configResolved.clearScreen = false` doesn't work
      config: {
        order: 'post',
        handler() {
          if (isErrorDebug()) {
            return { clearScreen: false }
          }
        },
      },
    },
  ]
}

function logDockerHint(configHost: ResolvedConfig['server']['host']) {
  if (isDocker()) {
    assertWarning(
      configHost,
      `Your app seems to be running inside a Docker or Podman container but ${pc.cyan('--host')} isn't set which means that your Vike app won't be accessible from outside the container, see https://vike.dev/docker`,
      { onlyOnce: true },
    )
  }
}
