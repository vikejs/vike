import { createServer } from 'vite'
import { devServerPlugin } from './devServerPlugin.js'

createServer({
  server: {
    middlewareMode: true
  },
  plugins: [
    devServerPlugin({
      onServerHotUpdate() {
        process.exit(33)
      }
    })
  ]
})
