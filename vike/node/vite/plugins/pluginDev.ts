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
      config() {
        return {
          appType: 'custom',
          // TODO:v1-release: remove (AFAICT we only need to use config.optimizeDeps for the old design)
          optimizeDeps: {
            exclude: [
              // We exclude Vike's client runtime to be able to use Vite's import.meta.glob()
              'vike/client',
              'vike/client/router',

              // It seems like client-side/isomorphic imports also need to be excluded, in order to avoid the following:
              //   ```
              //   Client runtime loaded twice https://vike.dev/client-runtime-duplicated
              //   ```
              'vike/routing',
              'vike/getPageContext',

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
        await determineOptimizeDeps(config)
        await determineFsAllowList(config)
        if (!isErrorDebug()) {
          await installHttpRequestAsyncStore()
          improveViteLogs(config)
        }
        logDockerHint(config.server.host)
      }
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

function logDockerHint(configHost: ResolvedConfig['server']['host']) {
  if (isDocker()) {
    assertWarning(
      configHost,
      `Your app seems to be running inside a Docker or Podman container but ${pc.cyan('--host')} isn't set which means that your Vike app won't be accessible from outside the container, see https://vike.dev/docker`,
      { onlyOnce: true }
    )
  }
}
