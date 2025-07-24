export { pluginWorkaroundVite6HmrRegression }

import type { Plugin } from 'vite'

// https://vite.dev/guide/migration (will be 404 after vite@7 release) > search for `hmrReload()`
// https://v6.vite.dev/guide/migration (will exist after vite@7 release) > search for `hmrReload()`
// Workaround seems to work for docs page /banner (which is HTML-only)
// But doesn't seem to work for /examples/render-modes/ (see https://github.com/vikejs/vike/pull/2069 commit `renable HMR test for HTML-only`)
function pluginWorkaroundVite6HmrRegression(): Plugin {
  return {
    name: 'vike:pluginWorkaroundVite6HmrRegression',
    enforce: 'post',
    hotUpdate: {
      order: 'post',
      handler(ctx) {
        console.log(
          'hotUpdate',
          this.environment.name,
          ctx.file,
          // Object.keys(ctx)
        )
        console.log(
          'ctx.modules',
          ctx.modules.map((m) => m.id),
        )
        // console.log('ctx.modules.length', ctx.modules.length)
        console.log(
          'ctx.modules => importers',
          ctx.modules.map((m) => Array.from(m.importers.values()).map((m) => m.id)),
        )
        // if (true as boolean) return [];
        const { modules, server, timestamp } = ctx
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
  }
}
