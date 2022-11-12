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
            'vite-plugin-ssr/routing',
            // We also have to exclude these because of `pnpm`
            '@brillout/json-serializer/parse',
            '@brillout/json-serializer/stringify'
          ]
        }
      }),
      async configResolved(config) {
        addOptimizeDepsEntries(config, await determineOptimizeDepsEntries(config))
        await determineFsAllowList(config)
      }
    },
    {
      name: 'vite-plugin-ssr:devConfig:serverMiddleware',
      apply: apply('dev', { skipMiddlewareMode: true, onlyViteCli: true }),
      configureServer(server) {
        return () => {
          addSsrMiddleware(server.middlewares)
        }
      }
    }
  ]
}

function addOptimizeDepsEntries(config: ResolvedConfig, entries: string[]) {
  const total = []

  const val = config.optimizeDeps.entries
  if (typeof val === 'string') {
    total.push(val)
  } else if (Array.isArray(val)) {
    total.push(...val)
  } else {
    assert(val === undefined)
  }

  total.push(...entries)

  config.optimizeDeps.entries = total
}

async function determineFsAllowList(config: ResolvedConfig) {
  const fsAllow = config.server.fs.allow

  // Current directory: vite-plugin-ssr/dist/cjs/node/plugin/plugins/
  const vitePluginSsrRoot = path.join(__dirname, '../../../../../')
  // Assert that `vitePluginSsrRoot` is indeed pointing to `node_modules/vite-plugin-ssr/`
  require.resolve(`${vitePluginSsrRoot}/dist/cjs/node/plugin/plugins/devConfig.js`)
  fsAllow.push(vitePluginSsrRoot)

  const globRoots = await getGlobRoots(config)
  globRoots.forEach(({ addFsAllowRoot }) => {
    if (addFsAllowRoot) {
      fsAllow.push(addFsAllowRoot)
    }
  })
}
