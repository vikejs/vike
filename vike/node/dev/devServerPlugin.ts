export { devServerPlugin }

import pc from '@brillout/picocolors'
import http from 'http'
import net from 'net'
import util from 'util'
import { ServerHMRConnector, type Plugin, type ViteDevServer } from 'vite'
import { ESModulesRunner, ViteRuntime } from 'vite/runtime'
import { getServerConfig } from '../plugin/plugins/serverEntryPlugin.js'
import { logViteAny } from '../plugin/shared/loggerNotProd.js'
import { assert } from '../runtime/utils.js'
import { bindCLIShortcuts } from './shortcuts.js'

function devServerPlugin(): Plugin {
  let viteServer: ViteDevServer
  let httpServers: http.Server[] = []
  let sockets: net.Socket[] = []
  let configureServerWasCalled = false
  let entryDeps = new Set()
  let runtime: ViteRuntime

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
    const serverConfig = getServerConfig()
    assert(serverConfig)
    const { reload } = serverConfig
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

  async function loadEntry() {
    entryDeps = new Set()
    const serverConfig = getServerConfig()
    assert(serverConfig)
    const entry = serverConfig.entry.index
    runtime.clearCache()
    await runtime.executeUrl(entry)
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
    async handleHotUpdate(ctx) {
      if (ctx.modules.some((m) => entryDeps.has(m.id))) {
        await onRestart()
      }
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

      runtime = new ViteRuntime(
        {
          root: viteServer.config.root,
          fetchModule: async (id, importer) => {
            const result = await viteServer.ssrFetchModule(id, importer)
            if ('file' in result && result.file) {
              entryDeps.add(result.file)
            }
            return result
          },
          hmr: { connection: new ServerHMRConnector(server), logger: false }
        },
        new ESModulesRunner()
      )

      loadEntry()
    }
  }
}
