export { devServerPlugin }

import net from 'net'
import http from 'http'
import util from 'util'

import type { Plugin, ViteDevServer } from 'vite'
import { getServerConfig } from '../plugin/plugins/serverEntryPlugin.js'
import { logViteAny } from '../plugin/shared/loggerNotProd.js'
import pc from '@brillout/picocolors'
import { assert } from '../runtime/utils.js'
import { bindCLIShortcuts } from './shortcuts.js'
import { getConfigVike } from '../shared/getConfigVike.js'

function devServerPlugin(): Plugin {
  let viteServer: ViteDevServer
  let entryDeps: Set<string>
  let httpServers: http.Server[] = []
  let sockets: net.Socket[] = []
  let configureServerWasCalled = false

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
    const anHttpServerWasClosed = httpServers.length > 0
    const promise = Promise.all([
      ...sockets.map((socket) => socket.destroy()),
      ...httpServers.map((httpServer) => util.promisify(httpServer.close.bind(httpServer))())
    ])
    sockets = []
    httpServers = []
    await promise
    return anHttpServerWasClosed
  }

  const onError = (err: unknown) => {
    console.error(err)
    closeAllServers().then((anHttpServerWasClosed) => {
      if (anHttpServerWasClosed) {
        // Note(brillout): we can do such polishing at the end of the PR, once we have nailed the overall structure. (I'm happy to help with the polishing.)
        logViteAny(
          `Server shutdown. Update a server file, or press ${pc.cyan('r + Enter')}, to restart.`,
          'info',
          null,
          true
        )
      }
    })
  }

  const onRestart = async () => {
    const { reload } = getServerConfig()!
    if (reload === 'fast') {
      await onFastRestart()
    } else {
      onFullRestart()
    }
  }

  const onFastRestart = async () => {
    await closeAllServers()
    await loadEntry()
  }

  const onFullRestart = async () => {
    process.exit(33)
  }

  return {
    name: 'vike:devServer',
    enforce: 'post',
    config() {
      return {
        server: {
          middlewareMode: true
        }
      }
    },
    async configResolved(config) {
      const configVike = await getConfigVike(config)
      config.optimizeDeps.exclude ??= []
      config.optimizeDeps.exclude.push(...configVike.native)
    },
    configureServer(server) {
      // This is only true if the vite config was changed
      // We need a full reload
      if (viteServer) {
        onFullRestart()
      }
      viteServer = server

      assert(!configureServerWasCalled)
      configureServerWasCalled = true
      process.on('unhandledRejection', onError)
      process.on('uncaughtException', onError)
      bindCLIShortcuts({
        onRestart: onFullRestart
      })
      patchHttp()
      loadEntry()
    },
    async handleHotUpdate(ctx) {
      if (!entryDeps || ctx.modules.some((module) => module.id && entryDeps.has(module.id))) {
        await onRestart()
      }
    }
  }
}
