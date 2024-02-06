export { startDevServer }

import pc from '@brillout/picocolors'
import { BirpcReturn, createBirpc } from 'birpc'
import http from 'http'
import { ModuleNode, createServer } from 'vite'
import { SHARE_ENV, Worker } from 'worker_threads'
import { getServerConfig } from '../plugin/plugins/serverEntryPlugin.js'
import { logViteAny } from '../plugin/shared/loggerNotProd.js'
import { assert } from '../runtime/utils.js'
import { bindCLIShortcuts } from './shortcuts.js'
import { ClientFunctions, ServerFunctions } from './types.js'

// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const workerPath = new URL('./worker.js', import.meta.url)
const viteMiddlewareProxyPort = 3333

async function startDevServer() {
  const vite = await createServer({
    server: {
      middlewareMode: true
    },
    plugins: [
      {
        name: 'vike:devserver',
        async handleHotUpdate(ctx) {
          if (exited) {
            await restartWorker()
            return
          }
          const mods = ctx.modules.map((m) => m.id).filter(Boolean) as string[]
          const shouldRestart = await rpc.invalidateDepTree(mods)
          if (shouldRestart) {
            await restartWorker()
          }
        }
      }
    ]
  })
  const httpServer = http.createServer(vite.middlewares)
  httpServer.listen(viteMiddlewareProxyPort)
  const serverConfig = getServerConfig()
  assert(serverConfig)
  const {
    entry: { index }
  } = serverConfig

  let rpc: BirpcReturn<ClientFunctions, ServerFunctions>
  let worker: Worker
  let exited = false
  async function restartWorker() {
    if (worker && !exited) {
      await worker.terminate()
    }
    worker = new Worker(workerPath, { env: SHARE_ENV, stdin: true })
    exited = false
    const listener = (data: Buffer) => worker.stdin?.emit('data', data)
    process.stdin.on('data', listener)
    worker.once('exit', (code) => {
      process.stdin.off('data', listener)
      if (code === 33) {
        exited = true
        logViteAny(
          `Server shutdown. Update a server file, or press ${pc.cyan('r + Enter')}, to restart.`,
          'info',
          null,
          true
        )
      }
    })

    rpc = createBirpc<ClientFunctions, ServerFunctions>(
      {
        fetchModule: vite.ssrFetchModule,
        moduleGraphResolveUrl(url: string) {
          return vite.moduleGraph.resolveUrl(url)
        },
        moduleGraphGetModuleById(id: string) {
          const module = vite.moduleGraph.getModuleById(id)
          if (!module) {
            return module
          }
          return flattenImportedModules(module)
        },
        transformIndexHtml(url: string, html: string, originalUrl?: string) {
          return vite.transformIndexHtml(url, html, originalUrl)
        }
      },
      {
        post: (data) => worker.postMessage(data),
        on: (data) => worker.on('message', data),
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

    // await configVikePromise because we can't stringify a promise
    // @ts-ignore
    const globalObjectOriginal = global._vike['globalContext.ts']
    globalObjectOriginal.viteDevServer.config.configVikePromise =
      await globalObjectOriginal.viteDevServer.config.configVikePromise
    const { viteConfig } = globalObjectOriginal

    await rpc.start({
      entry: index,
      viteMiddlewareProxyPort,
      viteConfig: { root: viteConfig.root, configVikePromise: viteConfig.configVikePromise }
    })
  }

  const ws = vite.hot.channels.find((ch) => ch.name === 'ws')
  bindCLIShortcuts({
    onRestart: async () => {
      await restartWorker()
      ws?.send({
        type: 'full-reload'
      })
    }
  })

  restartWorker()
}

function flattenImportedModules(moduleNode: ModuleNode) {
  const modules = new Set<ModuleNode>()

  function helper(node: ModuleNode) {
    if (!modules.has(node)) {
      modules.add(node)
      const importedModules = node.importedModules
      for (const importedModule of importedModules) {
        helper(importedModule)
      }
    }
  }

  helper(moduleNode)

  // this is the minimal representation the Vike runtime uses
  return {
    id: moduleNode.id,
    url: moduleNode.url,
    type: moduleNode.type,
    importedModules: new Set(
      Array.from(modules)
        .slice(1)
        .map((module) => ({
          id: module.id,
          url: module.url,
          type: module.type,
          // they are already flattened on the main module
          importedModules: new Set<ModuleNode>()
        }))
    )
  }
}
