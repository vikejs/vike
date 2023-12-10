import { createServer, resolveConfig } from 'vite'
import { logViteAny } from '../plugin/shared/loggerNotProd.js'
import { devServerPlugin } from './devServerPlugin.js'
import { getServerEntry } from '../plugin/plugins/serverEntryPlugin.js'

logViteAny('Starting development server', 'info', null, true)

startDevServer()

async function startDevServer() {
  const config = await resolveConfig({}, 'serve')
  const entry = getServerEntry()

  createServer({
    server: {
      middlewareMode: true
    },
    plugins: [
      devServerPlugin({
        entry,
        onServerHotUpdate() {
          process.exit(33)
        }
      })
    ]
  })
}
