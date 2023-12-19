export { getServerConfig, serverEntryPlugin }

import type { Plugin } from 'vite'
import type { ConfigVikeUserProvided, ServerResolved } from '../../../shared/ConfigVike.js'
import { assertUsage, getGlobalObject, assert, injectRollupInputs } from '../utils.js'
import { standalonePlugin } from './standalonePlugin.js'
import path from 'path'
import pc from '@brillout/picocolors'
import { createRequire } from 'module'
// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const require_ = createRequire(importMetaUrl)

const globalObject = getGlobalObject<{
  serverConfig: ServerResolved
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
      apply(_config, env) {
        //@ts-expect-error Vite 5 || Vite 4
        return !!(env.isSsrBuild || env.ssrBuild)
      },
      configResolved(config) {
        root = config.root
        let serverEntryFilePath = path.join(config.root, serverConfig.entry)
        try {
          serverEntryFilePath = require.resolve(serverEntryFilePath)
        } catch (err) {
          assert((err as Record<string, unknown>).code === 'MODULE_NOT_FOUND')
          assertUsage(
            false,
            `No file found at ${serverEntryFilePath}. Does the value ${pc.cyan(`'${serverConfig.entry}'`)} of ${pc.cyan(
              'server.entry'
            )} point to an existing file?`
          )
        }
        config.build.rollupOptions.input = injectRollupInputs({ index: serverEntryFilePath }, config)
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

function resolveServerConfig(configVike?: ConfigVikeUserProvided): ServerResolved {
  if (!configVike?.server) {
    return undefined
  }

  if (typeof configVike.server === 'object') {
    assertUsage(typeof configVike.server.entry === 'string', 'server.entry should be a string')
    assertUsage(['full', 'fast'].includes(configVike.server.reload), 'server.reload should be "full" or "fast"')

    return { entry: configVike.server.entry, reload: configVike.server.reload }
  }

  assertUsage(typeof configVike.server === 'string', 'server should be a string')
  return { entry: configVike.server, reload: 'full' }
}
