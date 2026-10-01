import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default { plugins: [react(), vike(), workerEnvironment()] }

// - Adds a Vite environment `worker` with config values of its own, see pages/+config.js
function workerEnvironment() {
  return {
    name: 'test:worker-environment',
    config() {
      return {
        environments: {
          worker: {
            consumer: 'server',
            // Bundle all dependencies, like @cloudflare/vite-plugin
            resolve: { noExternal: true },
            build: { outDir: 'dist/worker', rollupOptions: { input: './worker/entry.js' } },
          },
        },
        builder: {
          async buildApp(builder) {
            // - Built first: pre-rendering (while building ssr) loads it
            await builder.build(builder.environments.worker)
            await builder.build(builder.environments.client)
            await builder.build(builder.environments.ssr)
          },
        },
      }
    },
    // The name of the Vite environment that imports it
    resolveId(id) {
      if (id === 'virtual:environment-name') return '\0virtual:environment-name'
    },
    load(id) {
      if (id === '\0virtual:environment-name') return `export default ${JSON.stringify(this.environment.name)}`
    },
  }
}
