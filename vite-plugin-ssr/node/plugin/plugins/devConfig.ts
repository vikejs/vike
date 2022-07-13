export { devConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import { apply, addSsrMiddleware, findPageFiles, isSSR_config, assert } from '../utils'
import { getGlobRoots } from './generateImportGlobs/getGlobRoots'

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
        const globRoots = await getGlobRoots(config)
        const fsAllow = config.server.fs.allow
        globRoots
          .filter(({ pkgName }) => pkgName)
          .forEach(({ pkgRootResolved }) => {
            fsAllow.push(pkgRootResolved)
          })
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

async function determineOptimizeDepsEntries(config: ResolvedConfig): Promise<string[]> {
  const ssr = isSSR_config(config)
  assert(ssr === false) // In dev, `build.ssr` is always `false`
  const pageFiles = (await findPageFiles(config)).map(p => p.filePathAbsolue)
  return pageFiles
}
