import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export default { plugins: [react(), vike(), workerEnvironment()] }

// - Adds a Vite environment `worker` with config values of its own, see pages/+config.js
// - The `ssr` environment loads it via `virtual:load-worker`
function workerEnvironment() {
  const workerEntry = './worker/entry.js'
  let root
  let server
  return {
    name: 'test:worker-environment',
    config() {
      return {
        environments: {
          worker: {
            consumer: 'server',
            build: { outDir: 'dist/worker', rollupOptions: { input: { index: workerEntry } } },
          },
        },
        builder: {
          async buildApp(builder) {
            await builder.build(builder.environments.client)
            await builder.build(builder.environments.ssr)
            // - Built last: like every server-side environment, it contains Vike's server entry which needs the ssr build's assets manifest => /vike-runtime isn't pre-rendered
            await builder.build(builder.environments.worker)
          },
        },
      }
    },
    configResolved(config) {
      root = config.root
    },
    configureServer(server_) {
      server = server_
    },
    resolveId(id) {
      if (id === 'virtual:load-worker') return '\0virtual:load-worker'
    },
    load(id) {
      if (id !== '\0virtual:load-worker') return
      if (server) {
        globalThis.__loadWorker = () => server.environments.worker.runner.import(workerEntry)
        return 'export const loadWorker = () => globalThis.__loadWorker()'
      }
      const workerEntryBuilt = pathToFileURL(path.join(root, 'dist/worker/index.mjs')).href
      return `const url = ${JSON.stringify(workerEntryBuilt)}; export const loadWorker = () => import(/* @vite-ignore */ url)`
    },
  }
}
