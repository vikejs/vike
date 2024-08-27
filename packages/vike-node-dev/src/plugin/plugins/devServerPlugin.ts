import { fork } from 'child_process'
import { createServer, type IncomingMessage, type Server } from 'http'
import type { Plugin, ViteDevServer } from 'vite'
import { globalObject } from '../../__internal.js'
import type { ConfigVikeNodeDev } from '../../types.js'
import { assert } from '../../utils/assert.js'
import { isBun } from '../utils/isBun.js'
import { logViteInfo } from '../utils/logVite.js'

let viteDevServer: ViteDevServer
const VITE_HMR_PATH = '/__vite_hmr'
const RESTART_EXIT_CODE = 33
const IS_RESTARTER_SET_UP = '__VIKE__IS_RESTARTER_SET_UP'

export function devServerPlugin(config: ConfigVikeNodeDev): Plugin {
  let entryAbs: string
  let HMRServer: ReturnType<typeof createServer> | undefined
  let setupHMRProxyDone = false
  return {
    name: 'vite-node:devserver',
    apply: 'serve',
    enforce: 'pre',
    config: async () => {
      await setupProcessRestarter()

      if (isBun) {
        return {
          server: {
            middlewareMode: true
          }
        }
      }

      HMRServer = createServer()
      return {
        server: {
          middlewareMode: true,
          hmr: {
            server: HMRServer,
            path: VITE_HMR_PATH
          }
        }
      }
    },
    handleHotUpdate(ctx) {
      if (isImported(ctx.file)) {
        restartProcess()
      }
    },

    configureServer(vite) {
      if (viteDevServer) {
        restartProcess()
        return
      }

      viteDevServer = vite
      globalObject.viteDevServer = vite
      globalObject.setupHMRProxy = setupHMRProxy
      patchViteServer(vite)
      setupErrorStrackRewrite(vite)
      setupErrorHandlers()
      initializeServerEntry(vite)
    }
  }

  function isImported(id: string): boolean {
    const moduleNode = viteDevServer.moduleGraph.getModuleById(id)
    if (!moduleNode) {
      return false
    }
    const modules = new Set([moduleNode])
    for (const module of modules) {
      if (module.file === entryAbs) return true
      module.importers.forEach((importer) => modules.add(importer))
    }

    return false
  }

  function patchViteServer(vite: ViteDevServer) {
    vite.httpServer = { on: () => {} } as any
    vite.listen = (() => {}) as any
    vite.printUrls = () => {}
  }

  async function initializeServerEntry(vite: ViteDevServer) {
    assert(config.entry)
    const indexResolved = await vite.pluginContainer.resolveId(config.entry)
    assert(indexResolved?.id)
    entryAbs = indexResolved.id
    vite.ssrLoadModule(entryAbs).catch(logRestartMessage)
  }

  function setupHMRProxy(req: IncomingMessage) {
    if (setupHMRProxyDone || isBun) {
      return
    }

    setupHMRProxyDone = true
    const server = (req.socket as any).server as Server
    server.on('upgrade', (clientReq, clientSocket, wsHead) => {
      if (clientReq.url === VITE_HMR_PATH) {
        assert(HMRServer)
        HMRServer.emit('upgrade', clientReq, clientSocket, wsHead)
      }
    })
  }
}

function logRestartMessage() {
  logViteInfo('Server crash: Update a server file or type "r+enter" to restart the server.')
}

function setupErrorStrackRewrite(vite: ViteDevServer) {
  const rewroteStacktraces = new WeakSet()

  const _prepareStackTrace = Error.prepareStackTrace
  Error.prepareStackTrace = function prepareStackTrace(error, stack) {
    let ret = _prepareStackTrace?.(error, stack)
    if (!ret) return ret
    try {
      ret = vite.ssrRewriteStacktrace(ret)
      rewroteStacktraces.add(error)
    } catch (e) {
      console.warn('Failed to apply Vite SSR stack trace fix:', e)
    }
    return ret
  }

  const _ssrFixStacktrace = vite.ssrFixStacktrace
  vite.ssrFixStacktrace = function ssrFixStacktrace(e) {
    if (rewroteStacktraces.has(e)) return
    _ssrFixStacktrace(e)
  }
}

function setupErrorHandlers() {
  function onError(err: unknown) {
    console.error(err)
    logRestartMessage()
  }

  process.on('unhandledRejection', onError)
  process.on('uncaughtException', onError)
}

// We hijack the CLI root process: we block Vite and make it orchestrates server restarts instead.
// We execute the CLI again as a child process which does the actual work.
async function setupProcessRestarter() {
  if (isRestarterSetUp()) return
  process.env[IS_RESTARTER_SET_UP] = 'true'

  function start() {
    const cliEntry = process.argv[1]!
    const cliArgs = process.argv.slice(2)
    // Re-run the exact same CLI
    const clone = fork(cliEntry, cliArgs, { stdio: 'inherit' })
    clone.on('exit', (code) => {
      if (code === RESTART_EXIT_CODE) {
        start()
      } else {
        process.exit(code)
      }
    })
  }
  start()

  // Trick: never-resolving-promise in order to block the CLI root process
  await new Promise(() => {})
}

function isRestarterSetUp() {
  return process.env[IS_RESTARTER_SET_UP] === 'true'
}

function restartProcess() {
  logViteInfo('Restarting server...')
  assert(isRestarterSetUp())
  process.exit(RESTART_EXIT_CODE)
}
