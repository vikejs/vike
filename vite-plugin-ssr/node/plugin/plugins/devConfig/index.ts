export { devConfig }

import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
import { determineOptimizeDeps } from './determineOptimizeDeps'
import { determineFsAllowList } from './determineFsAllowList'
import { getConfigVps } from '../../../shared/getConfigVps'
import { addSsrMiddleware } from '../../shared/addSsrMiddleware'
import { markEnvAsDev } from '../../utils'
import { customClearScreen } from './customClearScreen'

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
            addSsrMiddleware(server.middlewares)
          }
        }
      }
    }
  ]
}
