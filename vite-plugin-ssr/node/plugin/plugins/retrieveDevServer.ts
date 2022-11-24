export { retrieveDevServer }

import type { Plugin } from 'vite'
import { setViteDevServer } from '../../globalContext'
import { setRuntimeConfig, RuntimeConfig, resolveRuntimeConfig } from '../../globalContext/runtimeConfig'
import { assert } from '../utils'
import { getConfigVps } from './config/assertConfigVps'

function retrieveDevServer(): Plugin {
  let runtimeConfig: RuntimeConfig
  return {
    name: 'vite-plugin-ssr:retrieveDevServer',
    configureServer(viteDevServer) {
      assert(runtimeConfig)
      setRuntimeConfig(runtimeConfig)
      setViteDevServer(viteDevServer)
    },
    async configResolved(config) {
      const configVps = await getConfigVps(config)
      runtimeConfig = resolveRuntimeConfig(config, configVps)
    }
  } as Plugin
}
