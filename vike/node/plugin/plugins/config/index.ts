// TODO: remove this file?
export { resolveVikeConfig }

import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
import type { ConfigVikeResolved } from '../../../../shared/ConfigVike.js'
import { assert, isDevCheck } from '../../utils.js'
import { getVikeConfig } from '../importUserCode/v1-design/getVikeConfig.js'

function resolveVikeConfig(vikeVitePluginOptions: unknown = {}): Plugin {
  let isDev: undefined | boolean
  return {
    name: 'vike:resolveVikeConfig',
    enforce: 'pre',
    apply(_config, env) {
      isDev = isDevCheck(env)
      return true
    },
    config() {
      return {
        _vikeVitePluginOptions: vikeVitePluginOptions
      } as UserConfig
    },
    async configResolved(config) {
      assert(typeof isDev === 'boolean')
      const promise = getConfigVikPromise(vikeVitePluginOptions, config, isDev)
      ;(config as Record<string, unknown>).configVikePromise = promise
      await promise
    }
  }
}

async function getConfigVikPromise(
  vikeVitePluginOptions: unknown,
  config: ResolvedConfig,
  isDev: boolean
): Promise<ConfigVikeResolved> {
  const { vikeConfigGlobal } = await getVikeConfig(config, isDev, {
    vikeVitePluginOptions
  })
  return vikeConfigGlobal
}
