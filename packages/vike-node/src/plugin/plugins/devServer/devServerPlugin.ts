import { createServer } from 'http'
import type { Plugin, ViteDevServer } from 'vite'
import { store } from '../../../runtime/env.js'
import type { ConfigVikeNodeResolved } from '../../../types.js'
import { assert } from '../../../utils/assert.js'
import { getConfigVikeNode } from '../../utils/getConfigVikeNode.js'
import { logViteInfo } from '../../utils/logVite.js'
import { bindCLIShortcuts } from './shortcuts.js'

let viteDevServer: ViteDevServer

export function devServerPlugin(): Plugin {
  let resolvedConfig: ConfigVikeNodeResolved
  let entryAbs: string
  const hmrServer = createServer()
  const hmrPath = '/__vite_hmr'
  return {
    name: 'vite-node:devserver',
    apply: 'serve',
    enforce: 'post',

    config: () => ({
      server: {
        middlewareMode: true,
        hmr: {
          server: hmrServer,
          path: hmrPath
        }
      }
    }),

    configResolved(config) {
      resolvedConfig = getConfigVikeNode(config)
    },

    hotUpdate(ctx) {
      if (ctx.environment.name === 'ssr' && isImported(ctx.file)) {
        restartProcess()
      }
    },

    configureServer(vite) {
      if (viteDevServer) {
        restartProcess()
        return
      }

      viteDevServer = vite
      store.viteDevServer = vite

      setupHMRMiddleware(vite)
      patchViteServer(vite)
      initializeServerEntry(vite)
    }
  }

  function isImported(id: string): boolean {
    const moduleNode = viteDevServer.environments.ssr.moduleGraph.getModuleById(id)
    assert(moduleNode)

    const modules = new Set([moduleNode])
    for (const module of modules) {
      if (module.file === entryAbs) return true
      module.importers.forEach((importer) => modules.add(importer))
    }

    return false
  }

  function setupHMRMiddleware(vite: ViteDevServer) {
    vite.middlewares.use((req, _res, next) => {
      if (req.url === hmrPath && req.headers['connection']?.toLowerCase() === 'upgrade') {
        hmrServer.emit('upgrade', req, req.socket, Buffer.from(''))
      } else {
        next()
      }
    })
  }

  function patchViteServer(vite: ViteDevServer) {
    vite.httpServer = true as any
    vite.listen = (() => {}) as any
    vite.printUrls = () => {}
    vite.bindCLIShortcuts = () => bindCLIShortcuts({ onRestart: restartProcess })
  }

  async function initializeServerEntry(vite: ViteDevServer) {
    assert(resolvedConfig.server)
    const index = resolvedConfig.server.entry.index
    const indexResolved = await vite.environments.ssr.pluginContainer.resolveId(index)
    assert(indexResolved?.id)
    entryAbs = indexResolved.id
    vite.ssrLoadModule(entryAbs)
  }
}

function restartProcess() {
  try {
    logViteInfo('Restarting server...')
    process.exit(33)
  } catch (error) {
    console.error('Failed to restart:', error)
    process.exit(1)
  }
}
