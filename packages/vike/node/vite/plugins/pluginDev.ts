export { pluginDev }
export { logDockerHint }

import { type Plugin, type ResolvedConfig, type UserConfig } from 'vite'
import { optimizeDeps, determineOptimizeDeps } from './pluginDev/optimizeDeps.js'
import { determineFsAllowList } from './pluginDev/determineFsAllowList.js'
import { addSsrMiddleware } from '../shared/addSsrMiddleware.js'
import { applyDev, assertWarning, isDocker, isDebugError } from '../utils.js'
import { interceptViteLogs } from '../shared/loggerVite.js'
import pc from '@brillout/picocolors'
import { swallowViteLogConnected, swallowViteLogConnected_clean } from '../shared/loggerVite.js'

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
            ...optimizeDeps,
          } satisfies UserConfig
        },
      },
      configResolved: {
        async handler(config_) {
          config = config_
          await determineOptimizeDeps(config)
          await determineFsAllowList(config)
          interceptViteLogs(config)
          logDockerHint(config.server.host)
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
          swallowViteLogConnected_clean() // If inside a configureServer() `pre` hook => too early
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
          swallowViteLogConnected()
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
