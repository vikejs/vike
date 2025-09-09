export { pluginWorkaroundVite6HmrRegression }

import type { Plugin } from 'vite'

// https://vite.dev/guide/migration (will be 404 after vite@7 release) > search for `hmrReload()`
// https://v6.vite.dev/guide/migration (will exist after vite@7 release) > search for `hmrReload()`
// Workaround seems to work for docs page /banner (which is HTML-only)
// But doesn't seem to work for /examples/render-modes/ (see https://github.com/vikejs/vike/pull/2069 commit `renable HMR test for HTML-only`)
function pluginWorkaroundVite6HmrRegression(): Plugin[] {
  return [{
    name: 'vike:pluginWorkaroundVite6HmrRegression',
    enforce: 'post',
    hotUpdate: {
      order: 'post',
      handler({ modules, server, timestamp }) {
        if (this.environment.name !== 'ssr') return

        let hasSsrOnlyModules = false

        const invalidatedModules = new Set<any>()
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
      },
    },
  }]
}
