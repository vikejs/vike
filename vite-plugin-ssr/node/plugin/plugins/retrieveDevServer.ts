export { retrieveDevServer }

import type { Plugin } from 'vite'
import { setViteDevServer } from '../../globalContext'
import { setRuntimeConfig, resolveRuntimeConfig } from '../../globalContext/runtimeConfig'
import { getConfigVps } from './config/assertConfigVps'

function retrieveDevServer(): Plugin {
  return {
    name: 'vite-plugin-ssr:retrieveDevServer',
    configureServer(viteDevServer) {
      setViteDevServer(viteDevServer)
    },
    async configResolved(config) {
      const configVps = await getConfigVps(config)
      const runtimeConfig = resolveRuntimeConfig(config, configVps)
      setRuntimeConfig(runtimeConfig)
    }
  } as Plugin
}
