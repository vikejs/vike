import { createBirpc } from 'birpc'
import { ESModulesRunner, ViteRuntime } from 'vite/runtime'
import { setIsWorkerEnv } from '../../../runtime/env.js'
import { logViteInfo } from '../../utils/logVite.js'
import type { ClientFunctions, ServerFunctions, WorkerData } from './types.js'

let runtime: ViteRuntime
let entry_: string

const rpc = createBirpc<ServerFunctions, ClientFunctions>(
  {
    async start(workerData: WorkerData) {
      const { entry, viteConfig } = workerData
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
      global._telefunc['globalContext.ts'] = {
        viteDevServer: globalObject.viteDevServer
      }

      runtime = new ViteRuntime(
        {
          fetchModule: rpc.fetchModule,
          root: viteConfig.root,
          hmr: false
        },
        new ESModulesRunner()
      )

      logViteInfo('Loading server entry')
      await runtime.executeUrl(entry)
    },
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
      process.send?.(data)
    },
    on: (data) => {
      process.on('message', data)
    },
    timeout: 1000
  }
)

setIsWorkerEnv()
