export { devServerPlugin }

import http from 'http'
import { nextTick } from 'process'
import type { Plugin, ViteDevServer } from 'vite'
import { getServerEntry } from '../plugin/plugins/serverEntryPlugin.js'
import { logViteAny } from '../plugin/shared/loggerNotProd.js'

async function devServerPlugin({ onServerHotUpdate }: { onServerHotUpdate: () => void }): Promise<Plugin> {
  let viteServer: ViteDevServer
  let entryDeps: Set<string>

  async function loadEntry() {
    const entry = getServerEntry()

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
        continue
      }

      for (const newDep of module.ssrTransformResult.deps || []) {
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

  return {
    name: 'vike:devServer',
    enforce: 'pre',
    config(config, env) {
      return {
        server: {
          middlewareMode: true
        }
      }
    },
    configureServer(server) {
      viteServer = server
      nextTick(async () => {
        const originalCreateServer = http.createServer.bind(http.createServer)

        http.createServer = (...args) => {
          //@ts-ignore
          const httpServer = originalCreateServer(...args)
          const listeners = httpServer.listeners('request')
          httpServer.removeAllListeners('request')
          httpServer.on('request', (req, res) => {
            viteServer.middlewares(req, res, () => {
              for (const listener of listeners) {
                listener(req, res)
              }
            })
          })

          return httpServer
        }

        await loadEntry()

        http.createServer = originalCreateServer
      })
    },
    handleHotUpdate(ctx) {
      if (!entryDeps) {
        return []
      }
      if (ctx.modules.some((module) => module.id && entryDeps.has(module.id))) {
        onServerHotUpdate()
        return []
      }
    }
  }
}
