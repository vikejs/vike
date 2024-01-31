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
  const serverEntryProdPlugin = (): Plugin => {
    return {
      name: 'vike:serverEntry',
      enforce: 'pre',
      apply(_config, env) {
        //@ts-expect-error Vite 5 || Vite 4
        return !!(env.isSsrBuild || env.ssrBuild)
      },
      config() {
        return {
          build: {
            rollupOptions: {
              // add extra entries for server-only usage
              // for example child_process.fork
              input: serverConfig.workers
            }
          }
        }
      },
      configResolved(config) {
        let serverEntryFilePath = path.join(config.root, serverConfig.entry)
        try {
          serverEntryFilePath = require_.resolve(serverEntryFilePath)
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
      }
    }
  }

  return [serverEntryProdPlugin(), configVike.standalone && standalonePlugin()].filter(Boolean) as Plugin[]
}

function resolveServerConfig(configVike?: ConfigVikeUserProvided): ServerResolved {
  if (!configVike?.server) {
    return undefined
  }

  if (typeof configVike.server === 'object') {
    assertUsage(typeof configVike.server.entry === 'string', 'server.entry should be a string')
    assertUsage(['full', 'fast'].includes(configVike.server.reload), 'server.reload should be "full" or "fast"')
    if (configVike.server.workers) {
      assertUsage(
        Array.isArray(configVike.server.workers) && configVike.server.workers.every((e) => typeof e === 'string'),
        'server.workers should be a string array'
      )
    }

    const workersProvided = configVike.server.workers ?? []
    const workersResolved: { [name: string]: string } = {}
    for (const worker of workersProvided) {
      const name = getEntryName(worker)
      workersResolved[name] = worker
    }

    return {
      entry: configVike.server.entry,
      reload: configVike.server.reload,
      workers: workersResolved
    }
  }

  assertUsage(typeof configVike.server === 'string', 'server should be a string')
  return { entry: configVike.server, reload: 'fast', workers: {} }
}

export const getEntryName = (input: string) => {
  const m = /([^\\\/]+)$/.exec(input)
  assertUsage(m?.[1], 'server.workers should be an array of relative paths')
  return m[1].split('.')[0]!
}
