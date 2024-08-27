export { commonConfig }

import type { Plugin } from 'vite'
import type { ConfigVikeNodeResolved } from '../../types.js'

function commonConfig(configVikeNodePlugin: ConfigVikeNodeResolved): Plugin[] {
  return [
    {
      enforce: 'pre',
      name: 'vike-node:commonConfig',
      config(config) {
        ;(config as Record<string, unknown>).configVikeNode = configVikeNodePlugin
        return {
          ssr: {
            external: configVikeNodePlugin.server.external
          },
          optimizeDeps: {
            exclude: configVikeNodePlugin.server.external
          }
        }
      }
    }
  ]
}
