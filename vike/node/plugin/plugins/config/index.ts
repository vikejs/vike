// TODO: remove this file?
export { resolveVikeConfig }

import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
import type { ConfigVikeResolved } from '../../../../shared/ConfigVike.js'
import { getVikeConfig } from '../importUserCode/v1-design/getVikeConfig.js'

function resolveVikeConfig(vikeVitePluginOptions: unknown = {}): Plugin {
  return {
    name: 'vike:resolveVikeConfig',
    enforce: 'pre',
    config() {
      return {
        _vikeVitePluginOptions: vikeVitePluginOptions
      } as UserConfig
    },
    async configResolved(config) {
      const promise = getConfigVikPromise(config)
      ;(config as Record<string, unknown>).configVikePromise = promise
      await promise
    }
  }
}

async function getConfigVikPromise(config: ResolvedConfig): Promise<ConfigVikeResolved> {
  const { vikeConfigGlobal } = await getVikeConfig(config)
  return vikeConfigGlobal
}
