export { pluginUpgradeDev }

import type { Plugin } from 'vite'
import { catchAllEntry } from '@universal-deploy/store'
import { isRunnableDevEnvironment } from '../../../../utils/isRunnableDevEnvironment.js'
import { assert } from '../../../../utils/assert.js'
import '../../assertEnvVite.js'

// +server.js > `upgrade()` in development — https://vike.dev/server#websockets
// - In production, see pluginUnwrapProdOptions.ts
function pluginUpgradeDev(): Plugin {
  return {
    name: 'vike:pluginUniversalDeploy:upgradeDev',
    apply: 'serve',
    configureServer(viteServer) {
      const { httpServer } = viteServer
      // Middleware mode => there isn't any HTTP server
      if (!httpServer) return
      let catchAllEntryResolved: string | undefined
      httpServer.on('upgrade', async (req, socket, head) => {
        // Vite's HMR WebSocket
        const protocol = req.headers['sec-websocket-protocol']
        if (protocol === 'vite-hmr' || protocol === 'vite-ping') return
        const ssr = viteServer.environments.ssr
        // E.g. @cloudflare/vite-plugin
        if (!ssr || !isRunnableDevEnvironment(ssr)) return
        try {
          if (!catchAllEntryResolved) {
            const resolved = await ssr.pluginContainer.resolveId(catchAllEntry)
            assert(resolved)
            catchAllEntryResolved = resolved.id
          }
          // Re-run upon +server.js modifications (like Universal Deploy's development middleware)
          const { default: server } = await ssr.runner.import(catchAllEntryResolved)
          server?.upgrade?.(req, socket, head)
        } catch (err) {
          console.error(err)
          socket.destroy()
        }
      })
    },
  }
}
