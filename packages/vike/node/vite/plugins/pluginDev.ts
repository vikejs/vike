export { pluginDev }
export { logDockerHint }

import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
import { determineOptimizeDeps } from './pluginDev/determineOptimizeDeps.js'
import { determineFsAllowList } from './pluginDev/determineFsAllowList.js'
import { addSsrMiddleware } from '../shared/addSsrMiddleware.js'
import { applyDev, assertWarning, isDocker, isDebugError } from '../utils.js'
import { improveViteLogs } from '../shared/loggerVite.js'
import pc from '@brillout/picocolors'
import {
  swallowViteConnectedMessage,
  swallowViteConnectedMessage_clean,
} from '../shared/loggerVite/removeSuperfluousViteLog.js'

// TODO: move
if (isDebugError()) {
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
            optimizeDeps: {
              exclude: [
                // We must exclude Vike's client runtime so it can import virtual modules
                'vike/client',
                'vike/client/router',
              ],
              include: [
                // Avoid:
                // ```
                // 9:28:58 AM [vite] ✨ new dependencies optimized: @brillout/json-serializer/parse
                // 9:28:58 AM [vite] ✨ optimized dependencies changed. reloading
                // ```
                'vike > @brillout/json-serializer/parse',
                'vike > @brillout/json-serializer/stringify',
                'vike > @brillout/picocolors',
              ],
            },
          } satisfies UserConfig
        },
      },
      configResolved: {
        async handler(config_) {
          config = config_
          await determineOptimizeDeps(config)
          await determineFsAllowList(config)
          improveViteLogs(config)
          logDockerHint(config.server.host)
        },
      },
    },
    {
      name: 'vike:pluginDev:pre',
      apply: applyDev,
      enforce: 'pre',
      configureServer: {
        order: 'pre',
        handler() {
          swallowViteConnectedMessage_clean()
        },
      },
    },
    {
      name: 'vike:pluginDev:post',
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
          if (isDebugError()) {
            return { clearScreen: false }
          }
        },
      },
      configResolved: {
        order: 'post',
        handler() {
          swallowViteConnectedMessage()
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
