export { buildApp }

import type { Plugin } from 'vite'
import { resolveOutDir } from '../shared/getOutDirs.js'
import { assert } from '../utils.js'

function buildApp(): Plugin {
  return {
    name: 'vike:buildApp',
    apply: 'build',
    config(config) {
      if (!config.vike!.global.config.useEnvironmentAPI) return

      console.log('SHOULD buildApp')

      return {
        appType: 'custom',
        builder: {
          buildApp: async (builder) => {
            assert(builder.environments.client)
            assert(builder.environments.ssr)
            console.log('BUILDING CLIENT')
            await builder.build(builder.environments.client)
            console.log('BUILDING SSR')
            await builder.build(builder.environments.ssr)
          }
        },
        environments: {
          ssr: {
            build: {
              outDir: resolveOutDir(config, true) || 'dist/server',
              ssr: true
            }
          }
        }
      }
    }
  }
}
