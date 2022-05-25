export { devConfig }

import type { Plugin } from 'vite'
import { apply, addSsrMiddleware } from '../utils'
import { pageFileExtensions } from './generateImportGlobs/pageFileExtensions'
import { getGlobRoots } from './generateImportGlobs/getGlobRoots'

function devConfig(): Plugin[] {
  return [
    {
      name: 'vite-plugin-ssr:devConfig',
      apply: apply('dev'),
      config: () => ({
        ssr: { external: ['vite-plugin-ssr'] },
        optimizeDeps: {
          entries: [`**/*.page.${pageFileExtensions}`, `**/*.page.client.${pageFileExtensions}`],
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
