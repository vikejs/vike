export { commonConfig }

import type { Plugin } from 'vite'
import type { ConfigVikeNodePlugin, ConfigVikeNodeResolved } from '../../types.js'
import { resolveConfig } from '../utils/resolveConfig.js'

function commonConfig(configVikeNodePlugin: ConfigVikeNodePlugin): Plugin {
  return {
    enforce: 'pre',
    name: 'vike-node:commonConfig',
    configResolved(config) {
      const resolvedConfig: ConfigVikeNodeResolved = resolveConfig({ server: configVikeNodePlugin })
      ;(config as Record<string, unknown>).configVikeNode = resolvedConfig

      if (typeof config.ssr.external !== 'boolean') {
        config.ssr.external ??= []
        config.ssr.external.push(...resolvedConfig.server.external)
      }
      config.optimizeDeps.exclude ??= []
      config.optimizeDeps.exclude.push(...resolvedConfig.server.external)
    }
  }
}
