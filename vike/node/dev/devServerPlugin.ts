export { devServerPlugin }

import http from 'http'
import { nextTick } from 'process'
import type { Plugin, ViteDevServer } from 'vite'
import { nativeDependecies } from '../plugin/shared/nativeDependencies.js'
import { getServerConfig } from '../plugin/plugins/serverEntryPlugin.js'
import { logViteAny } from '../plugin/shared/loggerNotProd.js'

function devServerPlugin(): Plugin {
  let viteServer: ViteDevServer
  let entryDeps: Set<string>

  async function loadEntry() {
    const { entry } = getServerConfig()!

    logViteAny('Loading server entry', 'info', null, true)
    const resolved = await viteServer.pluginContainer.resolveId(entry, undefined, {
      ssr: true
    })
    if (!resolved) {
      logViteAny(`Server entry "${entry}" not found`, 'error', null, true)
      return
    }
    await viteServer.ssrLoadModule(resolved.id)
    entryDeps = new Set<string>([resolved.id])
    for (const id of entryDeps) {
      const module = await viteServer.moduleGraph.getModuleById(id)
      if (!module) {
        continue
      }
      if (!module.ssrTransformResult) {
        module.ssrTransformResult = await viteServer.transformRequest(id, { ssr: true })
      }
      for (const newDep of module.ssrTransformResult?.deps || []) {
        if (!newDep.startsWith('/')) {
          continue
        }
        let newId: string

        if (newDep.startsWith('/@id/')) {
          newId = newDep.slice(5)
        } else {
          const resolved = await viteServer.pluginContainer.resolveId(newDep, id, {
            ssr: true
          })
          if (!resolved) {
            continue
          }
          newId = resolved.id
        }
        entryDeps.add(newId)
      }
    }
  }
  const patchCreateServer = () => {
    const originalCreateServer = http.createServer.bind(http.createServer)

    http.createServer = (...args) => {
      // @ts-ignore
      // Create the original server in user code
      const httpServer = originalCreateServer(...args)
      viteServer.httpServer ??= httpServer

      // Get the fresh listeners from the new module
      const listeners = httpServer.listeners('request')

      // Remove the stale listeners from httpServer instance
      httpServer.removeAllListeners('request')

      // Add the fresh listeners to the created httpServer (adds the vite middleware to
      // all user created httpServers, (should be ok, if Vite calls next() on unhandled req)
      httpServer.on('request', (req, res) => {
        viteServer.middlewares(req, res, () => {
          for (const listener of listeners) {
            listener(req, res)
          }
        })
      })
      const originalListen = httpServer.listen.bind(httpServer)

      // If multiple httpServers are created, make sure to return the right one (httpServer)
      httpServer.listen = (...args) => {
        // If this was a "fast" reload
        if (viteServer.httpServer?.listening) {
          return httpServer
        }

        // @ts-ignore
        return originalListen(...args)
      }
      return httpServer
    }
  }

  return {
    name: 'vike:devServer',
    enforce: 'pre',
    config(config, env) {
      return {
        server: {
          middlewareMode: true
        },
        optimizeDeps: { exclude: nativeDependecies }
      }
    },
    configureServer(server) {
      // If vite config is reloaded, configureServer is called again
      // Need to persist the active instance of httpServer
      const httpServer = viteServer?.httpServer
      viteServer = server
      viteServer.httpServer = httpServer
      patchCreateServer()

      nextTick(() => {
        loadEntry()
      })
    },
    handleHotUpdate(ctx) {
      if (ctx.modules.some((module) => module.id && entryDeps.has(module.id))) {
        const { reload } = getServerConfig()!
        if (reload === 'fast') {
          loadEntry()
        } else {
          process.exit(33)
        }
      }
    }
  }
}
