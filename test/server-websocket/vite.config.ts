import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import crossws from 'crossws/adapters/node'
import { defineConfig, type Plugin, type RunnableDevEnvironment } from 'vite'

export default defineConfig({
  plugins: [react(), vike(), websocketDev()],
})

// https://vike.dev/server#websockets
// Development (production: see +server.ts)
function websocketDev(): Plugin {
  return {
    name: 'websocket-dev',
    configureServer(server) {
      const ws = crossws({
        // Loaded by the same module runner as +server.js: modifying server/websocket.ts applies to new connections
        resolve: async () => {
          const { runner } = server.environments.ssr as RunnableDevEnvironment
          return (await runner.import('/server/websocket.ts')).websocket
        },
      })
      server.httpServer?.on('upgrade', (req, socket, head) => {
        // Vite's HMR WebSocket
        if (req.headers['sec-websocket-protocol'] === 'vite-hmr') return
        ws.handleUpgrade(req, socket, head)
      })
    },
  }
}
