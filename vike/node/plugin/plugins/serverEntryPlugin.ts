export type { ServerConfigResolved }
export { getServerConfig, serverEntryPlugin }

import type { Plugin } from 'vite'
import type { ConfigVikeUserProvided } from '../../../shared/ConfigVike.js'
import { assertUsage, getGlobalObject } from '../utils.js'
import { standalonePlugin } from './standalonePlugin.js'
import path from 'path'

type ServerConfigResolved =
  | {
      entry: string
      reload: 'reliable' | 'fast'
    }
  | undefined

const globalObject = getGlobalObject<{
  serverConfig: ServerConfigResolved
}>('serverEntryPlugin.ts', {
  serverConfig: undefined
})

function getServerConfig() {
  return globalObject.serverConfig
}

function serverEntryPlugin(configVike?: ConfigVikeUserProvided): Plugin[] {
  const serverConfig = configVike && resolveServerConfig(configVike)
  if (!serverConfig) {
    return []
  }
  globalObject.serverConfig = serverConfig
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
              input: { index: serverConfig.entry }
            }
          }
        }
      },
      configResolved(config) {
        root = config.root
      },
      renderChunk(code, chunk) {
        if (chunk.facadeModuleId === path.posix.join(root, serverConfig.entry)) {
          return ["import './importBuild.cjs';", "process.env.NODE_ENV = 'production';"].join('\n') + code
        }
      }
    }
  }

  return [
    serverEntryProdPlugin(),
    configVike.standalone && standalonePlugin({ serverEntry: serverConfig.entry })
  ].filter(Boolean) as Plugin[]
}

function resolveServerConfig(configVike?: ConfigVikeUserProvided) {
  if (!configVike?.server) {
    return undefined
  }

  if (typeof configVike.server === 'object') {
    assertUsage(typeof configVike.server.entry === 'string', 'server.entry should be a string')
    assertUsage(['reliable', 'fast'].includes(configVike.server.reload), 'server.reload should be "reliable" or "fast"')

    return { entry: configVike.server.entry, reload: configVike.server.reload } as const
  }

  assertUsage(typeof configVike.server === 'string', 'server should be a string')
  return { entry: configVike.server, reload: 'reliable' } as const
}
