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

  const originalCreateServer = http.createServer.bind(http.createServer)

  const patchCreateServer = () => {
    http.createServer = (...args) => {
      // @ts-ignore
      // Create the original server in user code
      const httpServer = originalCreateServer(...args)

      // Get the fresh listeners from the new module
      const listeners = httpServer.listeners('request')

      // Remove the stale listeners
      viteServer.httpServer ??= httpServer
      viteServer.httpServer.removeAllListeners('request')

      // Add the fresh listeners
      viteServer.httpServer.on('request', (req, res) => {
        viteServer.middlewares(req, res, () => {
          for (const listener of listeners) {
            listener(req, res)
          }
        })
      })

      const originalListen = httpServer.listen.bind(httpServer)
      httpServer.listen = (...args) => {
        restoreCreateServer()
        if (viteServer.httpServer?.listening) {
          return httpServer
        }

        // @ts-ignore
        return originalListen(...args)
      }
      return viteServer.httpServer
    }
  }

  const restoreCreateServer = () => {
    http.createServer = originalCreateServer
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
      viteServer = server
      nextTick(() => {
        patchCreateServer()
        loadEntry()
      })
    },
    handleHotUpdate(ctx) {
      if (ctx.modules.some((module) => module.id && entryDeps.has(module.id))) {
        const { reload } = getServerConfig()!

        if (reload === 'fast') {
          viteServer.moduleGraph.invalidateAll()
          patchCreateServer()
          loadEntry()
        } else {
          process.exit(33)
        }
      }
    }
  }
}
