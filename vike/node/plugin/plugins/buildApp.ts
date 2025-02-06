export { buildApp }

import type { Plugin } from 'vite'
import { assert } from '../utils.js'

function buildApp(): Plugin {
  return {
    name: 'vike:buildApp',
    apply: 'build',
    enforce: 'pre',
    config(config) {
      if (!config.vike!.global.config.useEnvironmentAPI) return

      console.log('SHOULD buildApp')

      return {
        appType: 'custom',
        builder: {
          buildApp: async (builder) => {
            console.log('buildApp')
            assert(builder.environments.client)
            assert(builder.environments.ssr)
            console.log('BUILDING CLIENT')
            await builder.build(builder.environments.client)
            console.log('BUILDING SSR')
            await builder.build(builder.environments.ssr)
          }
        }
      }
    }
  }
}
