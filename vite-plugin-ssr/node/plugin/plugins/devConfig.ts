export { devConfig }

import type { Plugin, ViteDevServer } from 'vite'
import { renderPage } from '../../renderPage'
import { apply, isViteCliCall } from '../utils'

function devConfig(): Plugin {
  return {
    name: 'vite-plugin-ssr:devConfig',
    apply: apply('dev'),
    config: () => ({
      ssr: { external: ['vite-plugin-ssr'] },
      optimizeDeps: {
        entries: ['**/*.page.*([a-zA-Z0-9])', '**/*.page.client.*([a-zA-Z0-9])'],
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
    configureServer(server) {
      if (isViteCliCall({ command: 'dev' })) {
        return addSsrMiddleware(server.middlewares)
      }
    },
  }
}

type ConnectServer = ViteDevServer['middlewares']

function addSsrMiddleware(middlewares: ConnectServer) {
  return () => {
    middlewares.use(async (req, res, next) => {
      if (res.headersSent) return next()
      const url = req.originalUrl || req.url
      if (!url) return next()
      const pageContextInit = { url }
      const pageContext = await renderPage(pageContextInit)
      if (!pageContext.httpResponse) return next()
      const { body, statusCode, contentType } = pageContext.httpResponse
      res.setHeader('Content-Type', contentType)
      res.statusCode = statusCode
      res.end(body)
    })
  }
}
