import pc from '@brillout/picocolors'
import http from 'http'
import net from 'net'
import util from 'util'
import { createServer } from 'vite'
import { ESModulesRunner, ViteRuntime } from 'vite/runtime'
import { getServerConfig } from '../plugin/plugins/serverEntryPlugin.js'
import { logViteAny } from '../plugin/shared/loggerNotProd.js'
import { assert } from '../runtime/utils.js'
import { bindCLIShortcuts } from './shortcuts.js'

start()

async function start() {
  let httpServers: http.Server[] = []
  let sockets: net.Socket[] = []

  const vite = await createServer({
    server: {
      middlewareMode: true
    },
    plugins: [
      {
        name: 'vike:devserver',
        async handleHotUpdate(ctx) {
          const mods = ctx.modules.map((m) => m.id).filter(Boolean) as string[]
          const shouldRestart = mods.some((m) => m && runtime.moduleCache.get(m).evaluated)
          runtime.moduleCache.invalidateDepTree(mods)

          if (shouldRestart) {
            await onRestart()
          }
        },
        buildEnd() {
          onFullRestart()
        }
      }
    ]
  })

  const serverConfig = getServerConfig()
  assert(serverConfig)
  const {
    reload,
    entry: { index }
  } = serverConfig

  process.on('unhandledRejection', onError)
  process.on('uncaughtException', onError)
  bindCLIShortcuts({
    onRestart: onFullRestart
  })

  const runtime = new ViteRuntime(
    {
      root: vite.config.root,
      fetchModule: vite.ssrFetchModule
    },
    new ESModulesRunner()
  )

  patchHttp()
  loadEntry()

  async function onRestart() {
    if (reload === 'fast') {
      await onFastRestart()
    } else {
      onFullRestart()
    }
  }

  async function onFastRestart() {
    await closeAllServers()
    await loadEntry()
  }

  function onFullRestart() {
    process.exit(33)
  }

  async function loadEntry() {
    await runtime.executeUrl(index)
  }

  async function closeAllServers() {
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

  function patchHttp() {
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
          vite.middlewares(req, res, () => {
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

  function onError(err: unknown) {
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
}
