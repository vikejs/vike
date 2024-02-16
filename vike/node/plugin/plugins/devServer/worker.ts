import { createBirpc } from 'birpc'
import { ESModulesRunner, ViteRuntime } from 'vite/runtime'
import { parentPort, workerData } from 'worker_threads'
import type { ClientFunctions, ServerFunctions, WorkerData } from './types.js'
import { assert } from '../../../runtime/utils.js'

let runtime: ViteRuntime
let entry_: string

const rpc = createBirpc<ServerFunctions, ClientFunctions>(
  {
    invalidateDepTree(mods) {
      const importersStr = new Set(mods)
      let shouldRestart = false
      for (let importer of importersStr) {
        const moduleCache = runtime.moduleCache.get(importer)
        if (moduleCache.meta && 'file' in moduleCache.meta && moduleCache.meta.file === entry_) {
          shouldRestart = true
        }
        if (moduleCache.importers) {
          for (const importerInner of moduleCache.importers) {
            importersStr.add(importerInner)
          }
        }
      }

      runtime.moduleCache.invalidateDepTree(mods)
      return shouldRestart
    },
    deleteByModuleId: (mod) => runtime.moduleCache.deleteByModuleId(mod)
  },
  {
    post: (data) => {
      assert(parentPort)
      parentPort.postMessage(data)
    },
    on: (data) => {
      assert(parentPort)
      parentPort.on('message', data)
    },
    timeout: 1000
  }
)

start()

async function start() {
  const { entry, viteConfig } = workerData as WorkerData
  entry_ = entry
  // This is the minimal required object for vike + telefunc to function
  const globalObject = {
    viteConfig,
    viteDevServer: {
      config: {
        ...viteConfig,
        logger: {
          // called by telefunc
          hasErrorLogged: () => false
        }
      },
      ssrLoadModule: (id: string) => runtime.executeUrl(id),
      // called by telefunc
      ssrFixStacktrace: (_err: unknown) => {},
      transformIndexHtml: rpc.transformIndexHtml,
      moduleGraph: {
        resolveUrl: rpc.moduleGraphResolveUrl,
        getModuleById: rpc.moduleGraphGetModuleById
      }
    }
  }

  //@ts-ignore
  global._vike ??= {}
  //@ts-ignore
  global._telefunc ??= {}
  //@ts-ignore
  global._vike['globalContext.ts'] = globalObject
  //@ts-ignore telefunc only needs viteDevServer.ssrLoadModule and viteDevServer.ssrFixStackTrace
  global._telefunc['globalContext.ts'] = { viteDevServer: globalObject.viteDevServer }

  runtime = new ViteRuntime(
    {
      fetchModule: rpc.fetchModule,
      root: viteConfig.root,
      hmr: false
    },
    new ESModulesRunner()
  )

  await runtime.executeUrl(entry)
  rpc.onLoadedEntry()
}
