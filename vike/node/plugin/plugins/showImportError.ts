export { showImportError }

import pc from '@brillout/picocolors'
import { nextTick } from 'process'
import type { Plugin } from 'vite'
import { logViteAny } from '../shared/loggerNotProd.js'

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
          if (
            /SyntaxError|TypeError|ERR_MODULE_NOT_FOUND|ERR_UNSUPPORTED_DIR_IMPORT|ERR_UNKNOWN_FILE_EXTENSION/.test(
              String(error)
            )
          ) {
            const packageName = id.split('/').slice(0, 2).join('/')

            logViteAny(
              `Please include ${pc.green(packageName)} in ${pc.green('ssr.noExternal')} ${pc.green(
                'https://vike.dev/broken-npm-package'
              )}`,
              'error',
              null,
              true
            )

            nextTick(() => {
              process.exit(1)
            })
          }

          throw error
        }
      }
      server.transformRequest = async (...args) => {
        const result = await originalTransformRequest(...args)
        if (result?.code) {
          result.code = result.code.replaceAll('__vite_ssr_import__(', '__vike_ssr_import__.bind(__vite_ssr_import__)(')
        }
        return result
      }
    }
  }
}
