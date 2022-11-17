export { retrieveDevServer }

import type { Plugin, ResolvedConfig } from 'vite'
import { setViteDevServer } from '../../globalContext'
import { assertUsage } from '../utils'

function retrieveDevServer(): Plugin {
  let config: ResolvedConfig
  return {
    name: 'vite-plugin-ssr:retrieveDevServer',
    configResolved(config_) {
      config = config_
    },
    configureServer(viteDevServer) {
      const { mode } = config
      assertUsage(
        mode === 'development',
        `When using Vite's development server (\`vite.createServer()\`), \`mode\` is expected to be \`development\` (it's \`${mode}\` instead).`
      )
      setViteDevServer(viteDevServer)
    }
  } as Plugin
}
