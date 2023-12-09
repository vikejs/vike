export { startDevServer }

import http from 'http'
import { onSsrHotUpdate } from '../plugin/plugins/serverEntryPlugin.js'
import { createServer } from 'vite'

async function startDevServer() {
  console.log('startDevServer called')

  const originalCreateServer = http.createServer.bind(http.createServer)

  http.createServer = (...args) => {
    //@ts-ignore
    const httpServer = originalCreateServer(...args)
    const listeners = httpServer.listeners('request')
    httpServer.removeAllListeners('request')
    httpServer.on('request', (req, res) => {
      viteServer.middlewares(req, res, () => {
        for (const listener of listeners) {
          listener(req, res)
        }
      })
    })

    onSsrHotUpdate(() => {
      process.exit(33)
    })

    return httpServer
  }

  const viteServer = await createServer({
    server: {
      middlewareMode: true
    },
    appType: 'custom'
  })
}

startDevServer()
