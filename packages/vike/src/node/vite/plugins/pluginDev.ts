export { pluginDev }
export { logDockerHint }

import { type Plugin, type ResolvedConfig, type UserConfig } from 'vite'
import { optimizeDeps, resolveOptimizeDeps } from './pluginDev/optimizeDeps.js'
import { determineFsAllowList } from './pluginDev/determineFsAllowList.js'
import { logSkillHint } from './pluginDev/logSkillHint.js'
import { addPlusMiddleware, addSsrMiddleware } from '../shared/addSsrMiddleware.js'
import type { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { getServerConfig } from './pluginUniversalDeploy/getServerConfig.js'
import { isRunnableDevServer } from '../../../server/runtime/globalContext.js'
import { isDebugError } from '../../../utils/debug.js'
import { applyDev } from '../../../utils/isDev.js'
import { isDocker } from '../../../utils/isDocker.js'
import { assertWarning } from '../../../utils/assert.js'
import { interceptViteLogs } from '../shared/loggerVite.js'
import pc from '@brillout/picocolors'
import { swallowViteLogConnected, swallowViteLogConnected_clean } from '../shared/loggerVite.js'
import '../assertEnvVite.js'

function pluginDev(vikeConfig: VikeConfigInternal): Plugin[] {
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
          logSkillHint(server, config.root)
          // A custom server or +server applies +middleware itself, and so does the server entry running elsewhere (e.g. workerd)
          if (hasCustomServer(config) || getServerConfig(vikeConfig) || !isRunnableDevServer(server)) return
          // Not `enforce: 'post'`: +middleware run before the middlewares of `post` plugins (e.g. Telefunc's)
          return () => {
            addPlusMiddleware(server.middlewares)
          }
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
          if (hasCustomServer(config)) return
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

function hasCustomServer(config: ResolvedConfig) {
  return config.server.middlewareMode || !!config.plugins.find((p) => p.name === '@hono/vite-dev-server')
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
