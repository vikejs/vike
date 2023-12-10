import { createServer } from 'vite'
import { logViteAny } from '../plugin/shared/loggerNotProd.js'
import { devServerPlugin } from './devServerPlugin.js'

logViteAny('Starting development server', 'info', null, true)

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
