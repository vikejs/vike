import { Plugin, ViteDevServer } from 'vite'
import { ConfigVikeUserProvided } from '../../../shared/ConfigVike.js'
import { standalone } from './standalonePlugin.js'
import { getGlobalObject } from '../utils.js'
import { nextTick } from 'process'

export const globalObject = getGlobalObject('serverEntryPlugin.ts', {
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
      console.log('Loading server entry')

      const resolved = await viteServer.pluginContainer.resolveId(serverEntry!, undefined, {
        ssr: true
      })

      if (!resolved) {
        console.error(`Server entry "${serverEntry}" not found`)
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
        nextTick(() => {
          loadEntry()
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
