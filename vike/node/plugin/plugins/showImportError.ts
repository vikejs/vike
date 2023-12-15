export { showImportError }

import type { Plugin } from 'vite'

function showImportError(): Plugin {
  return {
    name: 'vike:showImportError',
    enforce: 'pre',
    apply(_config, env) {
      return env.command === 'serve'
    },
    configureServer(server) {
      const originalTransformRequest = server.transformRequest.bind(server.transformRequest)

      //@ts-ignore
      global.__vike_ssr_import__ = async function (id: string) {
        try {
          return await (this as any)(id)
        } catch (error) {
          const snippet = {
            ssr: {
              noExternal: [id]
            }
          }

          console.error(`[Error]: failed to import ${id}. Please include ${id} in ssr.noExternal, in vite config.`)

          process.exit(1)
        }
      }
      server.transformRequest = async (...args) => {
        const result = await originalTransformRequest(...args)
        if (result?.code) {
          result.code = result.code.replaceAll('__vite_ssr_import__', '__vike_ssr_import__.bind(__vite_ssr_import__)')
        }
        return result
      }
    }
  }
}
