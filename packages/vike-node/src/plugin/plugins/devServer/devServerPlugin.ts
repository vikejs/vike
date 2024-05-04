export { devServerPlugin }

import pc from '@brillout/picocolors'
import { BirpcReturn, createBirpc } from 'birpc'
import { ChildProcess, fork } from 'child_process'
import {
  DevEnvironment,
  EnvironmentModuleNode,
  HMRChannel,
  Plugin,
  RemoteEnvironmentTransport,
  ViteDevServer
} from 'vite'
import { ConfigVikeNodeResolved } from '../../../types.js'
import { assert } from '../../../utils/assert.js'
import { getConfigVikeNode } from '../../utils/getConfigVikeNode.js'
import { logViteInfo } from '../../utils/logVite.js'
import { viteHmrPort, viteMiddlewareProxyPort } from './constants.js'
import { bindCLIShortcuts } from './shortcuts.js'
import type { ClientFunctions, MinimalModuleNode, ServerFunctions, WorkerData } from './types.js'

const workerPath = new URL('./worker.js', import.meta.url).pathname

let ws: HMRChannel | undefined
let vite: ViteDevServer
let rpc: BirpcReturn<ClientFunctions, ServerFunctions>
let cp: ChildProcess | undefined
let entryAbs: string
let onMessageHandler: (data: any) => void
let hmrHandler: ((data: any) => void) | undefined

function devServerPlugin(): Plugin {
  let resolvedConfig: ConfigVikeNodeResolved
  return {
    name: 'vike-node:devserver',
    apply: 'serve',
    enforce: 'post',
    config() {
      return {
        server: {
          port: viteMiddlewareProxyPort,
          hmr: {
            // this needs to be exposed in containers
            port: viteHmrPort
          }
        },
        environments: {
          ssr: {
            dev: {
              createEnvironment(name, config) {
                const hot = createSimpleHMRChannel({
                  name,
                  post: (data) => rpc.onHmrReceive(data),
                  on: (listener) => {
                    hmrHandler = listener
                    return () => {
                      hmrHandler = undefined
                    }
                  },
                  async onRestartWorker() {
                    await restartWorker()
                    vite.environments.client.hot.send({ type: 'full-reload' })
                  }
                })

                return new DevEnvironment('ssr', config, {
                  runner: {
                    transport: new RemoteEnvironmentTransport({
                      send: (data) => rpc.onViteTransportMessage(data),
                      onMessage: (handler) => {
                        onMessageHandler = handler
                      }
                    })
                  },
                  hot
                })
              }
            }
          }
        }
      }
    },
    configResolved(config) {
      resolvedConfig = getConfigVikeNode(config)
      assert(resolvedConfig.server)
    },
    async hotUpdate(ctx) {
      // console.log(ctx.environment.name, ctx.modules, ctx.type)
      if (ctx.environment.name !== 'ssr') {
        return
      }

      if (!cp) {
        await restartWorker()
        ctx.server.environments.client.hot.send({ type: 'full-reload' })
        return []
      }
    },
    // called on start & vite.config.js changes
    configureServer(vite_) {
      vite = vite_
      ws = vite.environments.client.hot
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
    if (cp) {
      await new Promise((resolve) => {
        cp!.once('exit', resolve)
        cp!.kill()
      })
    }

    assert(resolvedConfig.server)
    const index = resolvedConfig.server.entry.index

    const indexResolved = await vite.environments.ssr.pluginContainer.resolveId(index, undefined)
    assert(indexResolved?.id)
    entryAbs = indexResolved.id

    //@ts-ignore
    const configVikePromise = await vite.config.configVikePromise

    const workerData: WorkerData = {
      entry: entryAbs,
      viteConfig: { root: vite.config.root, configVikePromise }
    }
    cp = fork(workerPath, {
      env: process.env,
      stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      serialization: 'advanced'
    })

    rpc = createBirpc<ClientFunctions, ServerFunctions>(
      {
        onViteTransportMessage(data) {
          return onMessageHandler(data)
        },

        // These are used by Vike on the other side
        moduleGraphResolveUrl(url: string) {
          return vite.environments.ssr.moduleGraph.resolveUrl(url)
        },
        moduleGraphGetModuleById(id: string) {
          const module = vite.environments.ssr.moduleGraph.getModuleById(id)
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
        post: (data) => cp?.send(data),
        // eager
        on: (data) => cp!.on('message', data),
        timeout: 1000
      }
    )

    cp.once('exit', (code) => {
      if (code) {
        logViteInfo(`Server shutdown. Update a server file, or press ${pc.cyan('r + Enter')}, to restart.`)
      }

      cp = undefined
    })

    return rpc
      .start(workerData)
      .then(() => true)
      .catch(() => false)
  }
}

// This is the minimal representation the Vike runtime needs
function convertToMinimalModuleNode(
  node: EnvironmentModuleNode,
  cache: Map<EnvironmentModuleNode, MinimalModuleNode> = new Map()
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

function createSimpleHMRChannel(options: {
  name: string
  post: (data: any) => any
  on: (listener: (data: any) => void) => () => void
  onRestartWorker: () => void
}): HMRChannel {
  const listerMap = new DefaultMap<string, Set<Function>>(() => new Set())
  let dispose: (() => void) | undefined

  return {
    name: options.name,
    listen() {
      dispose = options.on((payload) => {
        for (const f of listerMap.get(payload.event)) {
          f(payload.data)
        }
      })
    },
    close() {
      dispose?.()
      dispose = undefined
    },
    on(event: string, listener: (...args: any[]) => any) {
      listerMap.get(event).add(listener)
    },
    off(event: string, listener: (...args: any[]) => any) {
      listerMap.get(event).delete(listener)
    },
    send(...args: any[]) {
      let payload: any
      if (typeof args[0] === 'string') {
        payload = {
          type: 'custom',
          event: args[0],
          data: args[1]
        }
      } else {
        payload = args[0]
      }

      if (payload.triggeredBy && isImported(payload.triggeredBy)) {
        options.onRestartWorker()
        return
      }

      options.post(payload)
    }
  }
}

class DefaultMap<K, V> extends Map<K, V> {
  constructor(
    private defaultFn: (key: K) => V,
    entries?: Iterable<readonly [K, V]>
  ) {
    super(entries)
  }

  override get(key: K): V {
    if (!this.has(key)) {
      this.set(key, this.defaultFn(key))
    }
    return super.get(key)!
  }
}

function isImported(id: string) {
  const moduleNode = vite.environments.ssr.moduleGraph.getModuleById(id)
  assert(moduleNode)
  const modules = new Set([moduleNode])
  for (const module of modules) {
    if (module.file === entryAbs) {
      return true
    }

    for (const importerInner of module.importers) {
      modules.add(importerInner)
    }
  }

  return false
}
