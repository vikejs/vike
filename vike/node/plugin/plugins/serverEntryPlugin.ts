import http from 'http'
import { nextTick } from 'process'
import { Plugin, ViteDevServer } from 'vite'
import { ConfigVikeUserProvided } from '../../../shared/ConfigVike.js'
import { logWithVikeTag } from '../shared/loggerNotProd/log.js'
import { getGlobalObject } from '../utils.js'
import { standalone } from './standalonePlugin.js'

const globalObject = getGlobalObject('serverEntryPlugin.ts', {
  onSsrHotUpdate: () => {}
})

export const onSsrHotUpdate = (onSsrHotUpdate: () => void) => {
  globalObject.onSsrHotUpdate = onSsrHotUpdate
}

export const serverEntryPlugin = (configVike?: ConfigVikeUserProvided): Plugin[] => {
  const serverEntry = configVike?.server
  if (!serverEntry) {
    return []
  }

  let isSsrBuild = false
  let viteServer: ViteDevServer
  let resolvedEntry: string
  let entryDeps: Set<string>

  const serverEntryPlugin = (): Plugin => {
    async function loadEntry() {
      logWithVikeTag('Loading server entry', 'info', null, true)

      const resolved = await viteServer.pluginContainer.resolveId(serverEntry!, undefined, {
        ssr: true
      })

      if (!resolved) {
        logWithVikeTag(`Server entry "${serverEntry}" not found`, 'error', null, false)
        return
      }

      resolvedEntry = resolved.id
      await viteServer.ssrLoadModule(resolvedEntry)

      entryDeps = new Set<string>([resolvedEntry])

      for (const id of entryDeps) {
        const module = await viteServer.moduleGraph.getModuleById(id)
        if (!module) {
          continue
        }

        if (!module.ssrTransformResult) {
          continue
        }

        for (const newDep of module.ssrTransformResult.deps || []) {
          if (!newDep.startsWith('/')) {
            continue
          }

          let newId: string

          if (newDep.startsWith('/@id/')) {
            newId = newDep.slice(5)
          } else {
            const resolved = await viteServer.pluginContainer.resolveId(newDep, id, {
              ssr: true
            })

            if (!resolved) {
              continue
            }

            newId = resolved.id
          }

          entryDeps.add(newId)
        }
      }
    }

    return {
      name: 'vike:serverEntry',
      enforce: 'pre',
      config(config, env) {
        //@ts-expect-error Vite 5 || Vite 4
        isSsrBuild = !!(env.isSsrBuild || env.ssrBuild)
        if (isSsrBuild) {
          return {
            build: {
              rollupOptions: {
                input: { index: serverEntry }
              }
            }
          }
        }
      },
      configureServer(server) {
        viteServer = server
        nextTick(async () => {
          const originalCreateServer = http.createServer.bind(http.createServer)

          http.createServer = (...args) => {
            //@ts-ignore
            const httpServer = originalCreateServer(...args)
            const listeners = httpServer.listeners('request')
            httpServer.removeAllListeners('request')
            httpServer.on('request', (req, res) => {
              viteServer.middlewares(req, res, () => {
                for (const listener of listeners) {
                  listener(req, res)
                }
              })
            })

            return httpServer
          }

          await loadEntry()

          http.createServer = originalCreateServer
        })
      },
      handleHotUpdate(ctx) {
        if (!entryDeps) {
          return []
        }
        if (ctx.modules.some((module) => module.id && entryDeps.has(module.id))) {
          globalObject.onSsrHotUpdate()
          return []
        }
      }
    }
  }

  return [serverEntryPlugin(), configVike.standalone && standalone()].filter(Boolean) as Plugin[]
}
