export { buildApp }

import { build } from 'vike/api'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
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
