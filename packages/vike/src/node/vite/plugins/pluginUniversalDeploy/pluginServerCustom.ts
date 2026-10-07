export { pluginServerCustom }

// `server: { custom: true }` => +server.js is the server entry as-is (manual integration via renderPage(), without Universal Deploy):
// - Build: dist/server/index.mjs is +server.js (all its exports are preserved, nothing is wrapped)
// - Dev: requests are forwarded to the `export default` of +server.js (a Node.js request handler such as an Express app, or a `{ fetch }` handler)

import type { Plugin, UserConfig } from 'vite'
import { createRequestAdapter } from '@universal-middleware/node/request'
import { sendResponse } from '@universal-middleware/node/response'
import { pluginServerEntryInject } from './pluginServerEntryInject.js'
import { isRunnableDevEnvironment } from '../../../../utils/isRunnableDevEnvironment.js'
import { assert, assertUsage } from '../../../../utils/assert.js'
import { isCallable } from '../../../../utils/isCallable.js'
import { isObject } from '../../../../utils/isObject.js'
import '../../assertEnvVite.js'

const requestAdapter = createRequestAdapter()

function pluginServerCustom(serverFilePath: string): Plugin[] {
  return [
    {
      name: 'vike:pluginServerCustom:build',
      apply: 'build',
      config: {
        order: 'post',
        handler() {
          const input = { index: serverFilePath }
          // Vite 8 (Rolldown) uses `build.rolldownOptions` instead of `build.rollupOptions`
          const isRolldown = !!this?.meta && 'rolldownVersion' in this.meta && !!this.meta.rolldownVersion
          const build = isRolldown ? { rolldownOptions: { input } } : { rollupOptions: { input } }
          return { environments: { ssr: { build } } } as UserConfig
        },
      },
    },
    {
      name: 'vike:pluginServerCustom:dev',
      apply: 'serve',
      configureServer(server) {
        let serverFileId: string | undefined
        return () => {
          server.middlewares.use(async (req, res, next) => {
            try {
              const ssr = server.environments.ssr
              assertUsage(
                ssr && isRunnableDevEnvironment(ssr),
                "`server: { custom: true }` requires Vite's `ssr` environment to be runnable in development",
              )
              serverFileId ??= (await ssr.pluginContainer.resolveId(serverFilePath))?.id
              assert(serverFileId)
              // Re-imported upon each request: the module runner caches it and invalidates it upon file change (server HMR)
              const { default: handler } = await ssr.runner.import<{ default?: unknown }>(serverFileId)
              if (isCallable(handler)) {
                // Node.js request handler, e.g. an Express app
                return handler(req, res, next)
              }
              if (isObject(handler) && isCallable(handler.fetch)) {
                const response: Response = await handler.fetch(requestAdapter(req, res))
                return await sendResponse(response, res)
              }
              assertUsage(
                false,
                `${serverFilePath} should \`export default\` a Node.js request handler (e.g. an Express app) or a \`{ fetch }\` handler, so that Vike can use it in development — see https://vike.dev/server#custom-integration`,
              )
            } catch (err) {
              next(err)
            }
          })
        }
      },
    },
    // dist/server/index.mjs imports dist/server/entry.mjs
    pluginServerEntryInject(serverFilePath),
  ]
}
