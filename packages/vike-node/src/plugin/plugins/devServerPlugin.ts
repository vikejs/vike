import { ServerResponse, createServer, type IncomingMessage } from 'http'
import type { Plugin, ViteDevServer } from 'vite'
import { globalStore } from '../../runtime/globalStore.js'
import type { ConfigVikeNodeResolved } from '../../types.js'
import { assert } from '../../utils/assert.js'
import { getConfigVikeNode } from '../utils/getConfigVikeNode.js'
import { isBun } from '../utils/isBun.js'
import { logViteInfo } from '../utils/logVite.js'

let viteDevServer: ViteDevServer
const VITE_HMR_PATH = '/__vite_hmr'

export function devServerPlugin(): Plugin {
  let resolvedConfig: ConfigVikeNodeResolved
  let entryAbs: string
  let HMRServer: ReturnType<typeof createServer> | undefined

  return {
    name: 'vite-node:devserver',
    apply: 'serve',
    enforce: 'post',

    config: () => {
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
      if (!isBun) {
        // With Bun, httpServer.on( "request", ... ) callback doesn't get called on websocket upgrade requests
        // We fallback to using a second server for HMR, served by Vite on port 24678 (default)
        globalStore.HMRProxy = HMRProxy
      }
      vite.middlewares.use(HMRProxy)
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

  /**
   * HMRProxy: WebSocket Upgrade Handler for Hot Module Replacement (HMR)
   *
   * This function is primarily needed because the WHATWG Response object doesn't natively
   * support returning a 101 (Switching Protocols) response along with a streaming WebSocket
   * response body. It acts as a middleware to handle WebSocket upgrades for HMR connections.
   *
   * Use Case:
   * - For frameworks that work with WHATWG Response objects (e.g., Hono, Hattip),
   *   this middleware should be placed at the beginning of the Node.js http request pipeline.
   * - For traditional Node.js frameworks (e.g., Express, Fastify), this middleware
   *   is not necessary as they can handle WebSocket upgrades natively.
   */
  function HMRProxy(req: IncomingMessage, res: ServerResponse, next?: (err?: unknown) => void): boolean {
    const canHandle = req.url === VITE_HMR_PATH && req.headers.upgrade === 'websocket'
    if (!canHandle) {
      next?.()
      return false
    }

    // Pause the socket to prevent data loss
    req.socket.pause()

    // Prepare the socket for upgrade
    req.socket.setTimeout(0)
    req.socket.setNoDelay(true)
    req.socket.setKeepAlive(true, 0)

    // Emit the upgrade event
    assert(HMRServer)
    HMRServer.emit('upgrade', req, req.socket, Buffer.alloc(0))

    // Resume the socket
    req.socket.resume()

    return true
  }
}

function restartProcess() {
  logViteInfo('Restarting server...')
  process.exit(33)
}
