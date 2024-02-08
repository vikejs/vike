export { startDevServer }
assertNodeVersion()

import pc from '@brillout/picocolors'
import { BirpcReturn, createBirpc } from 'birpc'
import http from 'http'
import { HMRChannel, ModuleNode, ViteDevServer, createServer } from 'vite'
import { SHARE_ENV, Worker } from 'worker_threads'
import { isNodeJS } from '../../utils/isNodeJS.js'
import { getServerConfig } from '../plugin/plugins/serverEntryPlugin.js'
import { logViteAny } from '../plugin/shared/loggerNotProd.js'
import { isVersionOrAbove } from '../plugin/utils.js'
import { assert, assertUsage } from '../runtime/utils.js'
import { getConfigVike } from '../shared/getConfigVike.js'
import { bindCLIShortcuts } from './shortcuts.js'
import { ClientFunctions, MinimalModuleNode, ServerFunctions } from './types.js'

// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const workerPath = new URL('./worker.js', import.meta.url)
const viteMiddlewareProxyPort = 3333

let ws: HMRChannel | undefined
let vite: ViteDevServer
let rpc: BirpcReturn<ClientFunctions, ServerFunctions>
let worker: Worker | undefined

async function startDevServer() {
  const httpServer = http.createServer()
  httpServer.listen(viteMiddlewareProxyPort)

  await createServer({
    server: {
      middlewareMode: true
    },
    plugins: [
      {
        name: 'vike:devserver',
        async handleHotUpdate(ctx) {
          if (!worker) {
            await restartWorker()
            return
          }
          const mods = ctx.modules.map((m) => m.id).filter(Boolean) as string[]
          const shouldRestart = await rpc.invalidateDepTree(mods)
          if (shouldRestart) {
            await restartWorker()
          }
        },
        // called on start & vite.config.js changes
        configureServer(vite_) {
          vite = vite_
          httpServer.removeAllListeners('request')
          httpServer.addListener('request', vite.middlewares)
          ws = vite.hot.channels.find((ch) => ch.name === 'ws')
          restartWorker()
        }
      }
    ]
  })

  bindCLIShortcuts({
    onRestart: async () => {
      await restartWorker()
      ws?.send({
        type: 'full-reload'
      })
    }
  })

  async function restartWorker() {
    const serverConfig = getServerConfig()
    assert(serverConfig)
    const {
      entry: { index }
    } = serverConfig
    // This might be needed, but slows down the restart
    // vite.moduleGraph.invalidateAll()
    if (worker) {
      await worker.terminate()
    }
    worker = new Worker(workerPath, { env: SHARE_ENV, stdin: true })
    const listener = (data: Buffer) => worker?.stdin!.emit('data', data)
    process.stdin.on('data', listener)
    worker.once('exit', (code) => {
      process.stdin.off('data', listener)
      if (code === 33) {
        worker = undefined
        logViteAny(
          `Server shutdown. Update a server file, or press ${pc.cyan('r + Enter')}, to restart.`,
          'info',
          null,
          true
        )
      }
    })

    const configVikePromise = await getConfigVike(vite.config)

    rpc = createBirpc<ClientFunctions, ServerFunctions>(
      {
        async fetchModule(id, importer) {
          const result = await vite.ssrFetchModule(id, importer)
          if (configVikePromise.native.includes(id)) {
            // sharp needs to load the .node file on this thread for some reason
            // maybe it's the case for other natives as well
            await import(id)
          }
          return result
        },
        moduleGraphResolveUrl(url: string) {
          return vite.moduleGraph.resolveUrl(url)
        },
        moduleGraphGetModuleById(id: string) {
          const module = vite.moduleGraph.getModuleById(id)
          if (!module) {
            return module
          }
          return convertToMinimalModuleNode(module)
        },
        transformIndexHtml(url: string, html: string, originalUrl?: string) {
          return vite.transformIndexHtml(url, html, originalUrl)
        }
      },
      {
        // lazy
        post: (data) => worker?.postMessage(data),
        // eager
        on: (data) => worker!.on('message', data),
        timeout: 1000
      }
    )

    const originalInvalidateModule = vite.moduleGraph.invalidateModule.bind(vite.moduleGraph)
    vite.moduleGraph.invalidateModule = (mod, ...rest) => {
      if (mod.id) {
        // timeout error
        rpc.deleteByModuleId(mod.id).catch(() => {})
      }
      return originalInvalidateModule(mod, ...rest)
    }

    logViteAny('Loading server entry', 'info', null, true)
    const entryAbs = await vite.pluginContainer.resolveId(index)
    assert(entryAbs?.id)
    await rpc.start({
      entry: entryAbs.id,
      viteMiddlewareProxyPort,
      viteConfig: { root: vite.config.root, configVikePromise }
    })
  }
}

// This is the minimal representation the Vike runtime needs
function convertToMinimalModuleNode(
  node: ModuleNode,
  cache: Map<ModuleNode, MinimalModuleNode> = new Map()
): MinimalModuleNode {
  // If the node is in the cache, return the cached version
  if (cache.has(node)) {
    return cache.get(node)!
  }

  // Create a new MinimalModuleNode object
  const minimalNode: MinimalModuleNode = {
    id: node.id,
    url: node.url,
    type: node.type,
    importedModules: new Set<MinimalModuleNode>()
  }

  // Add the new node to the cache
  cache.set(node, minimalNode)

  // Convert each imported module to a MinimalModuleNode
  for (const importedModule of node.importedModules) {
    minimalNode.importedModules.add(convertToMinimalModuleNode(importedModule, cache))
  }

  return minimalNode
}

function assertNodeVersion() {
  if (!isNodeJS()) return
  const version = process.versions.node
  assertUsage(isVersionOrAbove(version, '18.0.0'), `Node.js ${version} isn't supported, use Node.js >=18.0.0 instead.`)
}
