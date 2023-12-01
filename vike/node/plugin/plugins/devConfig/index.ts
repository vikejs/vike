export { devConfig }

import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
import { determineOptimizeDeps } from './determineOptimizeDeps.js'
import { determineFsAllowList } from './determineFsAllowList.js'
import { getConfigVike } from '../../../shared/getConfigVike.js'
import { addSsrMiddleware } from '../../shared/addSsrMiddleware.js'
import { markEnvAsDev } from '../../utils.js'
import { improveViteLogs } from '../../shared/loggerVite.js'
import { isErrorDebug } from '../../shared/isErrorDebug.js'
import { installHttpRequestAsyncStore } from '../../shared/getHttpRequestAsyncStore.js'

if (isErrorDebug()) {
  Error.stackTraceLimit = Infinity
}

// There doesn't seem to be a straightforward way to discriminate between `$ vite preview` and `$ vite dev`
const apply = 'serve'
const isDev = true

function devConfig(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vike:devConfig',
      apply,
      config() {
        return {
          appType: 'custom',
          // TODO:v1-release: remove (AFAICT we only need to use config.optimizeDeps for the old design)
          optimizeDeps: {
            exclude: [
              // We exclude Vike's client runtime to be able to use Vite's import.meta.glob()
              'vike/client',
              'vike/client/router',
              'vike/routing',

              // We exclude @brillout/json-serializer and @brillout/picocolors to avoid:
              // ```
              // 9:28:58 AM [vite] ✨ new dependencies optimized: @brillout/json-serializer/parse
              // 9:28:58 AM [vite] ✨ optimized dependencies changed. reloading
              // ```
              '@brillout/json-serializer/parse',
              '@brillout/json-serializer/stringify',
              '@brillout/picocolors',

              // We exclude all packages that depend on any optimizeDeps.exclude entry because, otherwise, the entry cannot be resolved when using pnpm. For example:
              // ```
              // Failed to resolve import "@brillout/json-serializer/parse" from "../../packages/vike-react-query/dist/renderer/VikeReactQueryWrapper.js". Does the file exist?
              // 343|  // ../../node_modules/.pnpm/react-streaming@0.3.16_react-dom@18.2.0_react@18.2.0/node_modules/react-streaming/dist/esm/client/useAsync.js
              // 344|  import { parse as parse2 } from "@brillout/json-serializer/parse";
              // ```
              // The source map is confusing, the import actually lives at node_modules/.vite/deps/vike-react-query_renderer_VikeReactQueryWrapper.js which contains:
              // ```js
              // // ../../node_modules/.pnpm/react-streaming@0.3.16_react-dom@18.2.0_react@18.2.0/node_modules/react-streaming/dist/esm/client/useAsync.js
              // import { parse as parse2 } from "@brillout/json-serializer/parse";
              // ```
              'react-streaming'
            ]
          }
        } satisfies UserConfig
      },
      async configResolved(config_) {
        config = config_
        const configVike = await getConfigVike(config)
        await determineOptimizeDeps(config, configVike, isDev)
        await determineFsAllowList(config, configVike)
        if (!isErrorDebug()) {
          await installHttpRequestAsyncStore()
          improveViteLogs(config)
        }
      },
      configureServer() {
        markEnvAsDev()
      }
    },
    {
      name: 'vike:devConfig:addSsrMiddleware',
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
      },
      // Setting `configResolved.clearScreen = false` doesn't work
      config: {
        order: 'post',
        handler() {
          if (isErrorDebug()) {
            return { clearScreen: false }
          }
        }
      }
    }
  ]
}
