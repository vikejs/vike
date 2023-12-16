export { devServerPlugin }

import net from 'net'
import http from 'http'
import util from 'util'

import type { Plugin, ViteDevServer } from 'vite'
import { nativeDependecies } from '../plugin/shared/nativeDependencies.js'
import { getServerConfig } from '../plugin/plugins/serverEntryPlugin.js'
import { logViteAny } from '../plugin/shared/loggerNotProd.js'

function devServerPlugin(): Plugin {
  let viteServer: ViteDevServer
  let entryDeps: Set<string>
  let httpServers: http.Server[] = []
  let sockets: net.Socket[] = []
  let patchedHttp = false

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
      const module = viteServer.moduleGraph.getModuleById(id)
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

  const patchHttp = () => {
    const originalCreateServer = http.createServer.bind(http.createServer)
    http.createServer = (...args) => {
      // @ts-ignore
      const httpServer = originalCreateServer(...args)

      httpServer.on('connection', (socket) => {
        sockets.push(socket)
        socket.on('close', () => {
          sockets = sockets.filter((socket) => !socket.closed)
        })
      })

      httpServer.on('listening', () => {
        const listeners = httpServer.listeners('request')
        httpServer.removeAllListeners('request')
        httpServer.on('request', (req, res) => {
          viteServer.middlewares(req, res, () => {
            for (const listener of listeners) {
              listener(req, res)
            }
          })
        })
      })
      httpServers.push(httpServer)
      return httpServer
    }
  }

  const closeAllServers = async () => {
    await Promise.all([
      ...sockets.map((socket) => socket.destroy()),
      ...httpServers.map((httpServer) => util.promisify(httpServer.close.bind(httpServer))())
    ])
    sockets = []
    httpServers = []
  }

  return {
    name: 'vike:devServer',
    enforce: 'pre',
    config() {
      return {
        server: {
          middlewareMode: true
        },
        optimizeDeps: { exclude: nativeDependecies }
      }
    },
    async configureServer(server) {
      viteServer = server
      if (!patchedHttp) {
        patchedHttp = true
        patchHttp()
      }

      process.nextTick(() => {
        loadEntry()
      })
    },
    // on vite config update
    async buildEnd() {
      const { reload } = getServerConfig()!
      if (reload === 'fast') {
        await closeAllServers()
      } else {
        process.exit(33)
      }
    },
    async handleHotUpdate(ctx) {
      if (ctx.modules.some((module) => module.id && entryDeps.has(module.id))) {
        const { reload } = getServerConfig()!
        if (reload === 'fast') {
          await closeAllServers()
          loadEntry()
        } else {
          process.exit(33)
        }
      }
    }
  }
}
