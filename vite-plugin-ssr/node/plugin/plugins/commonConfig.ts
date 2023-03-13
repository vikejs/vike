export { commonConfig }

import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
import { toPosixPath } from '../utils'

function commonConfig(): Plugin {
  return {
    name: 'vite-plugin-ssr:commonConfig',
    config: () => {
      const config: UserConfig = {
        appType: 'custom'
      }
      // Workaround for Vite's behavior of noExternalizing linked dependencies, https://github.com/vitejs/vite/discussions/9367
      if (isLinked()) config.ssr = { external: ['vite-plugin-ssr'] }
      return config
    },
    configResolved(config) {
      setDefaultPort(config)
      workaroundCI(config)
    }
  }
}

function isLinked() {
  return !toPosixPath(__dirname).includes('/node_modules/')
}

function setDefaultPort(config: ResolvedConfig) {
  // @ts-ignore
  config.server ??= {}
  config.server.port ??= 3000
  // @ts-ignore
  config.preview ??= {}
  config.preview.port ??= 3000
}

// Workaround GitHub Action failing to access the server
function workaroundCI(config: ResolvedConfig) {
  if (process.env.CI) {
    config.server.host ??= true
    config.preview.host ??= true
  }
}
