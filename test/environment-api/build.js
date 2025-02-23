import { build } from 'vike/api'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))

await buildApp()

async function buildApp() {
  process.env.NODE_ENV = 'production'
  await build({
    viteConfig: {
      logLevel: 'warn',
      root: __dirname,
      configFile: __dirname + '/vite.config.js'
    }
  })
}
