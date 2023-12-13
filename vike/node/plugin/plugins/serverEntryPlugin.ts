export { getServerEntry, serverEntryPlugin }

import type { Plugin } from 'vite'
import type { ConfigVikeUserProvided } from '../../../shared/ConfigVike.js'
import { getGlobalObject } from '../utils.js'
import { standalonePlugin } from './standalonePlugin.js'
import path from 'path'

const globalObject = getGlobalObject('serverEntryPlugin.ts', {
  serverEntry: ''
})

function getServerEntry() {
  return globalObject.serverEntry
}

function serverEntryPlugin(configVike?: ConfigVikeUserProvided): Plugin[] {
  const serverEntry = configVike?.server
  if (!serverEntry) {
    return []
  }
  globalObject.serverEntry = serverEntry
  let root = ''

  const serverEntryProdPlugin = (): Plugin => {
    return {
      name: 'vike:serverEntry',
      enforce: 'pre',
      apply(config, env) {
        //@ts-expect-error Vite 5 || Vite 4
        return !!(env.isSsrBuild || env.ssrBuild)
      },
      config(config, env) {
        return {
          build: {
            rollupOptions: {
              input: { index: serverEntry }
            }
          }
        }
      },
      configResolved(config) {
        root = config.root
      },
      renderChunk(code, chunk) {
        if (chunk.facadeModuleId === path.posix.join(root, serverEntry)) {
          return "import './importBuild.cjs'\n" + code
        }
      }
    }
  }

  return [serverEntryProdPlugin(), configVike.standalone && standalonePlugin({ serverEntry })].filter(
    Boolean
  ) as Plugin[]
}
