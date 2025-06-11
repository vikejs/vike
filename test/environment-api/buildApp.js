export { buildApp }

import { build } from 'vike/api'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))

async function buildApp() {
  process.env.NODE_ENV = 'production'
  await build({
    viteConfig: {
      root: __dirname,
      configFile: __dirname + '/vite.config.js',
    },
  })
}
