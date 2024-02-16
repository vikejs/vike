export { devServerPlugin }

import pc from '@brillout/picocolors'
import { BirpcReturn, createBirpc } from 'birpc'
import { HMRChannel, ModuleNode, Plugin, ViteDevServer } from 'vite'
import { SHARE_ENV, Worker } from 'worker_threads'
import { viteHmrPort, viteMiddlewareProxyPort } from './constants.js'
import { bindCLIShortcuts } from './shortcuts.js'
import { ClientFunctions, MinimalModuleNode, ServerFunctions, WorkerData } from './types.js'
import { getConfigVike } from '../../../shared/getConfigVike.js'
import { assert, assertUsage, isVersionOrAbove } from '../../utils.js'
import { isNodeJS } from '../../../../utils/isNodeJS.js'
import { logViteAny } from '../../shared/loggerNotProd.js'
import { ConfigVikeResolved } from '../../../../shared/ConfigVike.js'

assertNodeVersion()

// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url

const workerPath = new URL('./worker.js', importMetaUrl)

let ws: HMRChannel | undefined
let vite: ViteDevServer
let rpc: BirpcReturn<ClientFunctions, ServerFunctions>
let worker: Worker | undefined
let enabled = false

function devServerPlugin(): Plugin {
  let configVikePromise: ConfigVikeResolved
  return {
    name: 'vike:devserver',
    apply: 'serve',
    enforce: 'post',
    async configResolved(config) {
      configVikePromise = await getConfigVike(config)
      enabled = !!configVikePromise.server
      if (!enabled) return

      config.server.port = viteMiddlewareProxyPort
      if (typeof config.server.hmr !== 'boolean') {
        config.server.hmr ??= {}
        config.server.hmr.port = viteHmrPort
      } else {
        config.server.hmr = {
          port: viteHmrPort
        }
      }
    },
    async handleHotUpdate(ctx) {
      if (!enabled) return
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
      if (!enabled) return
      vite = vite_
      ws = vite.hot.channels.find((ch) => ch.name === 'ws')
      vite.bindCLIShortcuts = () =>
        bindCLIShortcuts({
          onRestart: async () => {
            if (await restartWorker()) {
              ws?.send({
                type: 'full-reload'
              })
            }
          }
        })
      vite.printUrls = () => {}
      restartWorker()
    }
  }

  async function restartWorker() {
    /* This might be needed, but slows down the restart
    vite.moduleGraph.invalidateAll()
    //*/

    if (worker) {
      await worker.terminate()
    }

    assert(configVikePromise.server)
    const index = configVikePromise.server.entry.index

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
    const workerData: WorkerData = {
      entry: entryAbs.id,
      viteConfig: { root: vite.config.root, configVikePromise }
    }
    worker = new Worker(workerPath, {
      env: SHARE_ENV,
      stdin: true,
      workerData
    })

    let loaded: (success: boolean) => void
    rpc = createBirpc<ClientFunctions, ServerFunctions>(
      {
        onLoadedEntry() {
          loaded(true)
        },
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

    worker.once('error', (err) => {
      console.error(err)
      logViteAny(
        `Server shutdown. Update a server file, or press ${pc.cyan('r + Enter')}, to restart.`,
        'info',
        null,
        true
      )
    })
    const listener = (data: Buffer) => worker?.stdin!.emit('data', data)
    process.stdin.on('data', listener)
    worker.once('exit', () => {
      process.stdin.off('data', listener)
      worker = undefined
      loaded(false)
    })
    return new Promise<boolean>((loaded_) => {
      loaded = loaded_
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
