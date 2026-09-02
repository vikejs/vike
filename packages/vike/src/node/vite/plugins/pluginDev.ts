export { pluginDev }
export { logDockerHint }

import { type Plugin, type ResolvedConfig, type UserConfig } from 'vite'
import { optimizeDeps, resolveOptimizeDeps } from './pluginDev/optimizeDeps.js'
import { determineFsAllowList } from './pluginDev/determineFsAllowList.js'
import { checkVikeSkill } from './pluginDev/vikeSkill.js'
import { addSsrMiddleware } from '../shared/addSsrMiddleware.js'
import { isDebugError } from '../../../utils/debug.js'
import { setTimeoutUnref } from '../../../utils/setTimeoutUnref.js'
import { applyDev } from '../../../utils/isDev.js'
import { isDocker } from '../../../utils/isDocker.js'
import { assertWarning } from '../../../utils/assert.js'
import { interceptViteLogs } from '../shared/loggerVite.js'
import pc from '@brillout/picocolors'
import { swallowViteLogConnected, swallowViteLogConnected_clean } from '../shared/loggerVite.js'
import '../assertEnvVite.js'

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
          await resolveOptimizeDeps(config)
          await determineFsAllowList(config)
          interceptViteLogs(config)
          logDockerHint(config.server.host)
        },
      },
      configureServer: {
        handler(server) {
          // Check whether the user installed Vike's skill for AI agents (https://vike.dev/ai#install) — late, so that it never slows down dev start nor the first page requests: 5 seconds after the first request, or at most 10 seconds after the server started.
          let isDone = false
          const runAfter = (milliseconds: number) => {
            setTimeoutUnref(() => {
              if (isDone) return
              isDone = true
              checkVikeSkill(config.root)
            }, milliseconds)
          }
          if (server.httpServer) {
            server.httpServer.once('listening', () => runAfter(10 * 1000))
          } else {
            // Middleware mode: the HTTP server is owned by the user
            runAfter(10 * 1000)
          }
          let isFirstRequest = true
          server.middlewares.use((_req, _res, next) => {
            if (isFirstRequest) {
              isFirstRequest = false
              runAfter(5 * 1000)
            }
            next()
          })
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
