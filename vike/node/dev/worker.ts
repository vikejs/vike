import { createBirpc } from 'birpc'
import http, { IncomingMessage } from 'http'
import { Readable } from 'stream'
import { ESModulesRunner, ViteRuntime } from 'vite/runtime'
import { parentPort } from 'worker_threads'
import { assert } from '../runtime/utils.js'
import { ClientFunctions, ServerFunctions } from './types.js'

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
    deleteByModuleId: (mod) => runtime.moduleCache.deleteByModuleId(mod),
    async start({ entry, viteMiddlewareProxyPort, viteConfig }) {
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

      patchHttp(viteMiddlewareProxyPort)
      runtime = new ViteRuntime(
        {
          fetchModule: rpc.fetchModule,
          root: viteConfig.root,
          hmr: false
        },
        new ESModulesRunner()
      )

      await runtime.executeUrl(entry)
    }
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

function patchHttp(httpPort: number) {
  const proxyReq = async (req: IncomingMessage) => {
    if (req.url?.includes('_telefunc')) {
      return {
        ok: false
      } as const
    }
    return fetch(`http://127.0.0.1:${httpPort}${req.url}`, {
      headers: parseHeaders(req.headers),
      method: req.method
    })
  }

  const originalCreateServer = http.createServer.bind(http.createServer)
  http.createServer = (...args) => {
    //@ts-ignore
    const httpServer = originalCreateServer(...args)
    httpServer.on('listening', () => {
      const listeners = httpServer.listeners('request')
      httpServer.removeAllListeners('request')
      httpServer.on('request', async (req, res) => {
        const result = await proxyReq(req)
        const ok = 'status' in result && ((200 <= result.status && result.status <= 299) || result.status === 304)
        if (ok) {
          res.statusCode = result.status
          for (const [k, v] of result.headers) {
            res.setHeader(k, v)
          }

          if (result.body) {
            //@ts-ignore
            Readable.fromWeb(result.body).pipe(res)
          } else {
            res.end()
          }
          return
        }

        for (const listener of listeners) {
          listener(req, res)
        }
      })
    })
    return httpServer
  }
}

export const parseHeaders = (
  headers: Record<string, string | string[] | undefined> | Headers
): Record<string, string> => {
  const result: Record<string, string> = {}
  if (typeof headers.forEach === 'function') {
    headers.forEach((value, key) => {
      if (Array.isArray(value)) {
        result[key] = value[0]
      } else {
        result[key] = value || ''
      }
    })
  } else {
    for (const [key, value] of Object.entries(headers)) {
      if (Array.isArray(value)) {
        result[key] = value[0]
      } else {
        result[key] = value || ''
      }
    }
  }

  return result
}
process.on('unhandledRejection', onError)
process.on('uncaughtException', onError)
function onError(err: unknown) {
  console.error(err)
  process.exit(33)
}
