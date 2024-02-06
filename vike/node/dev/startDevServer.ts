import { BirpcReturn, createBirpc } from 'birpc'
import http from 'http'
import { ModuleNode, createServer } from 'vite'
import { SHARE_ENV, Worker } from 'worker_threads'
import { getServerConfig } from '../plugin/plugins/serverEntryPlugin.js'
import { assert } from '../runtime/utils.js'
import { ClientFunctions, ServerFunctions } from './types.js'
import { stringify } from '@brillout/json-serializer/stringify'
import { parse } from '@brillout/json-serializer/parse'

// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const workerPath = new URL('./worker.js', import.meta.url)
const viteMiddlewareProxyPort = 3333

start()

async function start() {
  const vite = await createServer({
    server: {
      middlewareMode: true
    },
    plugins: [
      {
        name: 'vike:devserver',
        async handleHotUpdate(ctx) {
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

  async function restartWorker() {
    if (worker) {
      await worker.terminate()
    }

    worker = new Worker(workerPath, { env: SHARE_ENV })

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
          return removeFunctions(flattenImportedModules(module))
        },
        transformIndexHtml(url: string, html: string, originalUrl?: string) {
          return vite.transformIndexHtml(url, html, originalUrl)
        }
      },
      {
        post: (data) => worker.postMessage(data),
        on: (data) => worker.on('message', data),
        serialize: (v) => stringify(v),
        deserialize: (v) => parse(v)
      }
    )

    const originalInvalidateModule = vite.moduleGraph.invalidateModule.bind(vite.moduleGraph)
    vite.moduleGraph.invalidateModule = (mod, ...rest) => {
      if (mod.id) {
        rpc.deleteByModuleId(mod.id)
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

  restartWorker()
}

function removeFunctions(obj: any) {
  const seenObjects = new WeakSet()

  function helper(currentObj: any) {
    if (currentObj === null || typeof currentObj !== 'object') {
      return currentObj
    }

    if (seenObjects.has(currentObj)) {
      return
    }
    seenObjects.add(currentObj)

    let newObj: any
    if (currentObj instanceof Set) {
      newObj = new Set()
      for (let value of currentObj) {
        if (typeof value !== 'function') {
          newObj.add(helper(value))
        }
      }
    } else if (currentObj instanceof Map) {
      newObj = new Map()
      for (let [key, value] of currentObj) {
        if (typeof value !== 'function') {
          newObj.set(key, helper(value))
        }
      }
    } else {
      newObj = Array.isArray(currentObj) ? [] : {}
      for (let key in currentObj) {
        let value = currentObj[key]
        if (typeof value === 'function') {
          continue
        } else if (typeof value === 'object') {
          value = helper(value)
        }
        newObj[key] = value
      }
    }
    return newObj
  }

  return helper(obj)
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

  // this is the minimal representation that Vike runtime uses
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
