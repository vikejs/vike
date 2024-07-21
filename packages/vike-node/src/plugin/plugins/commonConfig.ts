export { commonConfig }

import type { Plugin } from 'vite'
import { ConfigVikeNode, ConfigVikeNodeResolved } from '../../types.js'
import { resolveConfig } from '../utils/resolveConfig.js'

function commonConfig(configVikeNode: ConfigVikeNode): Plugin {
  return {
    enforce: 'pre',
    name: 'vike-node:commonConfig',
    configResolved(config) {
      const resolvedConfig: ConfigVikeNodeResolved = resolveConfig(configVikeNode)
      ;(config as Record<string, unknown>).configVikeNode = resolvedConfig

      if (typeof config.ssr.external !== 'boolean') {
        config.ssr.external ??= []
        config.ssr.external.push(...resolvedConfig.server.native)
      }
      config.optimizeDeps.exclude ??= []
      config.optimizeDeps.exclude.push(...resolvedConfig.server.native)
    }
  }
}
