export { devConfig }

import type { LogType, Plugin, ResolvedConfig, UserConfig } from 'vite'
import { determineOptimizeDeps } from './determineOptimizeDeps'
import { determineFsAllowList } from './determineFsAllowList'
import { getConfigVps } from '../../../shared/getConfigVps'
import { addSsrMiddleware } from '../../shared/addSsrMiddleware'
import { hasLogged, markEnvAsDev } from '../../utils'
import { logRuntimeMsg_set } from '../../../runtime/renderPage/runtimeLogger'

// There doesn't seem to be a straightforward way to discriminate between `$ vite preview` and `$ vite dev`
const apply = 'serve'
const isDev = true

function devConfig(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vite-plugin-ssr:devConfig',
      apply,
      async config() {
        return {
          optimizeDeps: {
            exclude: [
              // We exclude the vite-plugin-ssr client to be able to use `import.meta.glob()`
              'vite-plugin-ssr/client',
              'vite-plugin-ssr/client/router',
              'vite-plugin-ssr/routing',
              // - We also exclude @brillout/json-serializer to avoid:
              //   ```
              //   9:28:58 AM [vite] ✨ new dependencies optimized: @brillout/json-serializer/parse
              //   9:28:58 AM [vite] ✨ optimized dependencies changed. reloading
              //   ```
              // - Previously, we had to exclude @brillout/json-serializer because of pnpm, but this doesn't seem to be the case anymore
              '@brillout/json-serializer/parse',
              '@brillout/json-serializer/stringify'
            ]
          }
        } satisfies UserConfig
      },
      async configResolved(config_) {
        config = config_
        const configVps = await getConfigVps(config)
        await determineOptimizeDeps(config, configVps, isDev)
        await determineFsAllowList(config, configVps)
        customClearScreen(config)
      },
      configureServer() {
        markEnvAsDev()
      }
    },
    {
      name: 'vite-plugin-ssr:devConfig:addSsrMiddleware',
      apply,
      // The SSR middleware should be last middleware
      enforce: 'post',
      configureServer: {
        order: 'post',
        handler(server) {
          if (config.server.middlewareMode) return
          return () => {
            logRuntimeMsg_set((msg) => console.log(msg))
            addSsrMiddleware(server.middlewares, server)
          }
        }
      }
    }
  ]
}

function customClearScreen(config: ResolvedConfig) {
  if (config.clearScreen === false) {
    return
  }
  intercetLogger(
    'info',
    config,
    // Allow initial clear if no assertWarning() was shown
    (msg) => msg.includes('VITE') && msg.includes('ready in') && !hasLogged()
  )
  intercetLogger('warn', config)
  intercetLogger('error', config)
}

type Logger = (...args: [string, { clear?: boolean } | undefined]) => void

function intercetLogger(logType: LogType, config: ResolvedConfig, tolerateClear?: (msg: string) => boolean) {
  const loggerOld = config.logger[logType].bind(config.logger)
  const loggerNew: Logger = (...args) => {
    const [msg, options] = args
    if (options?.clear && !tolerateClear?.(msg)) {
      options.clear = false
    }
    loggerOld(...args)
  }
  config.logger[logType] = loggerNew
}
