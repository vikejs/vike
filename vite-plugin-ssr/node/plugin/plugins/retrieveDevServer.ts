export { retrieveDevServer }

import type { Plugin } from 'vite'
import { setGlobalContextViteDevServer, setGlobalContextConfigVps } from '../../globalContext'
import { setRuntimeConfig, resolveRuntimeConfig } from '../../globalContext/runtimeConfig'
import { getConfigVps } from './config/assertConfigVps'

function retrieveDevServer(): Plugin {
  return {
    name: 'vite-plugin-ssr:retrieveDevServer',
    configureServer(viteDevServer) {
      setGlobalContextViteDevServer(viteDevServer)
    },
    async configResolved(config) {
      const configVps = await getConfigVps(config)
      setGlobalContextConfigVps(configVps)
      const runtimeConfig = resolveRuntimeConfig(config, configVps)
      setRuntimeConfig(runtimeConfig)
    }
  } as Plugin
}
