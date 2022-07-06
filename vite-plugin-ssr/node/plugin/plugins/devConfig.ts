export { devConfig }

import type { Plugin } from 'vite'
import { apply, addSsrMiddleware, javascriptFileExtensions } from '../utils'
import { getGlobRoots } from './generateImportGlobs/getGlobRoots'
import * as vite from 'vite'
const viteVersion = (vite as { version?: string }).version || '2.?.?'

function devConfig(): Plugin[] {
  return [
    {
      name: 'vite-plugin-ssr:devConfig',
      apply: apply('dev'),
      config: () => ({
        ssr: { external: ['vite-plugin-ssr'] },
        optimizeDeps: {
          entries:
            process.env.CI && viteVersion.startsWith('2.')
              ? [`**/*.page.${javascriptFileExtensions}`, `**/*.page.client.${javascriptFileExtensions}`]
              : // Ideally we should use `fast-glob` to determine the index page files
                [
                  `/pages/index.page.${javascriptFileExtensions}`,
                  `/pages/index.page.client.${javascriptFileExtensions}`,
                  `/pages/index/index.page.${javascriptFileExtensions}`,
                  `/pages/index/index.page.client.${javascriptFileExtensions}`,
                ],
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
