export { devConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert } from '../utils'
import { apply, addSsrMiddleware } from '../helpers'
import { determineOptimizeDepsEntries } from './devConfig/determineOptimizeDepsEntries'
import { getGlobRoots } from './generateImportGlobs/getGlobRoots'
import path from 'path'

function devConfig(): Plugin[] {
  return [
    {
      name: 'vite-plugin-ssr:devConfig',
      apply: apply('dev'),
      config: () => ({
        ssr: { external: ['vite-plugin-ssr'] },
        optimizeDeps: {
          exclude: [
            // We exclude the client code to support `import.meta.glob()`
            'vite-plugin-ssr/client',
            'vite-plugin-ssr/client/router',
            // We cannot add these to `optimizeDeps.include` because of `pnpm`
            '@brillout/libassert',
            '@brillout/json-s',
            '@brillout/json-s/parse',
            '@brillout/json-s/stringify',
          ],
        },
      }),
      async configResolved(config) {
        assert(config.optimizeDeps.entries === undefined)
        config.optimizeDeps.entries = await determineOptimizeDepsEntries(config)
        await determineFsAllowList(config)
      },
    },
    {
      name: 'vite-plugin-ssr:dev:ssr-middleware',
      apply: apply('dev', { skipMiddlewareMode: true, onlyViteCli: true }),
      configureServer(server) {
        return addSsrMiddleware(server.middlewares)
      },
    },
  ]
}

async function determineFsAllowList(config: ResolvedConfig) {
  const fsAllow = config.server.fs.allow

  // Current directory: vite-plugin-ssr/dist/cjs/node/plugin/plugins/
  const vitePluginSsrRoot = path.join(__dirname, '../../../../../')
  // Assert that `vitePluginSsrRoot` is indeed pointing to `node_modules/vite-plugin-ssr/`
  require.resolve(`${vitePluginSsrRoot}/dist/cjs/node/plugin/plugins/devConfig.js`)
  fsAllow.push(vitePluginSsrRoot)

  const globRoots = await getGlobRoots(config)
  globRoots
    .filter(({ pkgName }) => pkgName)
    .forEach(({ pkgRootResolved }) => {
      fsAllow.push(pkgRootResolved)
    })
}
