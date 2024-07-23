import { ServerResponse, createServer, type IncomingMessage, type Server } from 'http'
import { type Plugin, type ViteDevServer } from 'vite'
import { globalStore } from '../../runtime/globalStore.js'
import type { ConfigVikeNodeResolved } from '../../types.js'
import { assert } from '../../utils/assert.js'
import { getConfigVikeNode } from '../utils/getConfigVikeNode.js'
import { logViteInfo } from '../utils/logVite.js'

let viteDevServer: ViteDevServer
const VITE_HMR_PATH = '/__vite_hmr'

export function devServerPlugin(): Plugin {
  let resolvedConfig: ConfigVikeNodeResolved
  let entryAbs: string
  let setupHMRProxyDone = false
  const HMRServer = createServer()

  return {
    name: 'vite-node:devserver',
    apply: 'serve',
    enforce: 'post',

    config: () => ({
      server: {
        middlewareMode: true,
        hmr: {
          server: HMRServer,
          path: VITE_HMR_PATH
        }
      }
    }),

    configResolved(config) {
      resolvedConfig = getConfigVikeNode(config)
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
      globalStore.viteDevServer = vite
      globalStore.HMRProxy = HMRProxy
      patchViteServer(vite)
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
    assert(resolvedConfig.server)
    const index = resolvedConfig.server.entry.index
    const indexResolved = await vite.pluginContainer.resolveId(index)
    assert(indexResolved?.id)
    entryAbs = indexResolved.id
    vite.ssrLoadModule(entryAbs)
  }

  function HMRProxy(req_: IncomingMessage, res_: ServerResponse, next?: (err?: unknown) => void): boolean {
    function nextIfCantHandle() {
      if (req_.url !== VITE_HMR_PATH) {
        next?.()
        return false
      }
      return true
    }

    if (setupHMRProxyDone) {
      return nextIfCantHandle()
    }

    setupHMRProxyDone = true
    const server = (req_.socket as any).server as Server
    server.on('upgrade', (clientReq, clientSocket, wsHead) => {
      if (clientReq.url === VITE_HMR_PATH) {
        HMRServer.emit('upgrade', clientReq, clientSocket, wsHead)
      }
    })

    if (req_.url === VITE_HMR_PATH) {
      viteDevServer.middlewares(req_, res_)
    }

    return nextIfCantHandle()
  }
}

function restartProcess() {
  logViteInfo('Restarting server...')
  process.exit(33)
}
