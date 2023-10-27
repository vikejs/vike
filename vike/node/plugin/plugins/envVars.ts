export { envVarsPlugin }

// For ./envVars.spec.ts
export { applyEnvVar }

import type { Plugin, ResolvedConfig } from 'vite'
import { loadEnv } from 'vite'
import {
  assert,
  assertPosixPath,
  assertUsage,
  assertWarning,
  escapeRegex,
  getFilePathRelativeToUserRootDir,
  lowerFirst
} from '../utils.js'

function envVarsPlugin(): Plugin {
  let envsAll: Record<string, string>
  let config: ResolvedConfig
  return {
    name: 'vike:env',
    enforce: 'post',
    configResolved(config_) {
      config = config_
      config.command
      envsAll = loadEnv(config.mode, config.envDir || config.root, '')
      // Vite's built-in plugin vite:define needs to apply after this plugin.
      //  - This plugin vike:env needs to apply after vike:extractAssets and vike:extractExportNames which need to apply after @vitejs/plugin-vue
      ;(config.plugins as Plugin[]).sort(lowerFirst<Plugin>((plugin) => (plugin.name === 'vite:define' ? 1 : 0)))
    },
    transform(code, id, options) {
      assertPosixPath(id)
      if (id.includes('/node_modules/')) return
      if (!id.startsWith(config.root)) return
      if (!code.includes('import.meta.env.')) return

      const isBuild = config.command === 'build'
      const isClientSide = getIsClientSide(config, options)

      Object.entries(envsAll)
        .filter(([key]) => {
          // Already handled by Vite
          const envPrefix = !config.envPrefix
            ? []
            : Array.isArray(config.envPrefix)
            ? config.envPrefix
            : [config.envPrefix]
          return !envPrefix.some((prefix) => key.startsWith(prefix))
        })
        .forEach(([envName, envVal]) => {
          // Security check
          {
            const envStatement = getEnvStatement(envName)
            const publicPrefix = 'PUBLIC_ENV__'
            const isPrivate = !envName.startsWith(publicPrefix)
            if (isPrivate && isClientSide) {
              if (!code.includes(envStatement)) return
              const filePathToShowToUser = getFilePathRelativeToUserRootDir(id, config.root)
              const errMsgAddendum: string = isBuild ? '' : ' (Vike will prevent your app from building for production)'
              const keyPublic = `${publicPrefix}${envName}` as const
              const errMsg =
                `${envStatement} is used in client-side file ${filePathToShowToUser} which means that the environment variable ${envName} will be included in client-side bundles and, therefore, ${envName} will be publicly exposed which can be a security leak${errMsgAddendum}. Use ${envStatement} only in server-side files, or rename ${envName} to ${keyPublic}, see https://vike.dev/env` as const
              if (isBuild) {
                assertUsage(false, errMsg)
              } else {
                // Only a warning for faster development DX (e.g. when user toggles `ssr: boolean` or `onBeforeRenderIsomorph: boolean`)
                assertWarning(false, errMsg, { onlyOnce: true })
              }
            }
            // Double check
            assert(!(isPrivate && isClientSide) || !isBuild)
          }

          // Apply
          code = applyEnvVar(envName, envVal, code)
        })

      // No need for low-resolution source map since line numbers didn't change. (Does Vite do high-resolution column numbers source mapping?)
      return code
    }
  }
}
function applyEnvVar(envName: string, envVal: string, code: string) {
  const envStatement = getEnvStatement(envName)
  const regex = new RegExp(escapeRegex(envStatement) + '\b', 'g')
  return code.replace(regex, JSON.stringify(envVal))
}
function getEnvStatement(envName: string) {
  return `import.meta.env.${envName}` as const
}

function getIsClientSide(config: ResolvedConfig, options?: { ssr?: boolean }): boolean {
  const isBuild = config.command === 'build'
  if (isBuild) {
    assert(typeof config.build.ssr === 'boolean')
    const isServerSide: boolean = config.build.ssr
    if (options !== undefined) {
      assert(options.ssr === isServerSide)
    }
    return !isServerSide
  } else {
    assert(config.build.ssr === false)
    assert(typeof options?.ssr === 'boolean')
    const isServerSide: boolean = options.ssr
    return !isServerSide
  }
}
