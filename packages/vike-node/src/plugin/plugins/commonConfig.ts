export { commonConfig }

import type { Plugin } from 'vite'
import { ConfigVikeNodeResolved } from '../../types.js'
import { resolveConfig } from '../utils/resolveConfig.js'
import type { Config } from 'vike/types'

function commonConfig(): Plugin {
  return {
    enforce: 'pre',
    name: 'vike-node:commonConfig',
    configResolved(config) {
      const { server } = (config as Record<string, unknown>)._vikeConfig as Config
      const resolvedConfig: ConfigVikeNodeResolved = resolveConfig({ server })
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
