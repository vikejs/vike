export { vite6HmrRegressionWorkaround }

import type { Plugin, EnvironmentModuleNode } from 'vite'

// https://vite.dev/guide/migration (will be 404 after vite@7 release) > search for `hmrReload()`
// https://v6.vite.dev/guide/migration (will exist after vite@7 release) > search for `hmrReload()`
function vite6HmrRegressionWorkaround(): Plugin {
  return {
    name: 'vike:vite6HmrRegressionWorkaround',
    enforce: 'post',
    hotUpdate: {
      order: 'post',
      handler({ modules, server, timestamp }) {
        if (this.environment.name !== 'ssr') return

        let hasSsrOnlyModules = false

        const invalidatedModules = new Set<EnvironmentModuleNode>()
        for (const mod of modules) {
          if (mod.id == null) continue
          const clientModule = server.environments.client.moduleGraph.getModuleById(mod.id)
          if (clientModule != null) continue

          this.environment.moduleGraph.invalidateModule(mod, invalidatedModules, timestamp, true)
          hasSsrOnlyModules = true
        }

        if (hasSsrOnlyModules) {
          server.ws.send({ type: 'full-reload' })
          return []
        }
      }
    }
  }
}
