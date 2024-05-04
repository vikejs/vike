import { createBirpc } from 'birpc'
import { ESModulesEvaluator, ModuleRunner, RemoteRunnerTransport } from 'vite/module-runner'
import { setIsWorkerEnv } from '../../../runtime/env.js'
import { logViteInfo } from '../../utils/logVite.js'
import type { ClientFunctions, ServerFunctions, WorkerData } from './types.js'

let runner: ModuleRunner
let hmrHandler: (data: any) => void
let viteTransportHandler: (data: any) => void
const rpc = createBirpc<ServerFunctions, ClientFunctions>(
  {
    onHmrReceive(data) {
      hmrHandler(data)
    },
    onViteTransportMessage(data) {
      viteTransportHandler(data)
    },
    async start(workerData: WorkerData) {
      const { entry, viteConfig } = workerData
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
          ssrLoadModule: (id: string) => runner.import(id),
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

      runner = new ModuleRunner(
        {
          root: viteConfig.root,
          transport: new RemoteRunnerTransport({
            send(data) {
              rpc.onViteTransportMessage(data)
            },
            onMessage(handler) {
              viteTransportHandler = handler
            }
          }),
          hmr: {
            connection: {
              onUpdate(callback) {
                hmrHandler = callback
              },
              isReady() {
                return true
              },
              send(messages) {}
            }
          }
        },
        new ESModulesEvaluator()
      )
      logViteInfo('Loading server entry')
      await runner.import(entry)
    }
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
