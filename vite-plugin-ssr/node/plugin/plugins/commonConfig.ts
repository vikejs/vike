export { commonConfig }

import type { Plugin, ResolvedConfig } from 'vite'

function commonConfig(): Plugin {
  return {
    name: 'vite-plugin-ssr:commonConfig',
    config: () => ({ spa: false }),
    configResolved(config) {
      setDefaultPort(config)
      workaroundCI(config)
    },
  }
}

function setDefaultPort(config: ResolvedConfig) {
  // @ts-ignore
  config.server ??= {}
  config.server.port ??= 3000
  // @ts-ignore
  config.preview ??= {}
  config.preview.port ??= 3000
}

// Workaround GitHub Action running on MacOS failing to access the server
function workaroundCI(config: ResolvedConfig) {
  if (process.env.CI && process.platform === 'darwin') {
    config.server.host ??= true
    config.preview.host ??= true
  }
}
