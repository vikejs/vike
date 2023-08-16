export { envVarsPlugin }

import type { Plugin, ResolvedConfig } from 'vite'
import { loadEnv } from 'vite'
import { assert, assertPosixPath, assertUsage, assertWarning, getFilePathVite, lowerFirst } from '../utils.js'

function envVarsPlugin(): Plugin {
  let envsAll: Record<string, string>
  let config: ResolvedConfig
  return {
    name: 'vite-plugin-ssr:env',
    enforce: 'post',
    configResolved(config_) {
      config = config_
      config.command
      envsAll = loadEnv(config.mode, config.envDir || config.root, '')
      // Vite's built-in plugin vite:define needs to apply after this plugin.
      //  - This plugin vite-plugin-ssr:env needs to apply after vite-plugin-ssr:extractAssets and vite-plugin-ssr:extractExportNames which need to apply after @vitejs/plugin-vue
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
        .forEach(([key, val]) => {
          const varName = `import.meta.env.${key}` as const
          const publicPrefix = 'PUBLIC_ENV__'
          const keyPublic = `${publicPrefix}${key}` as const
          const isPrivate = !key.startsWith(publicPrefix)
          if (isPrivate && isClientSide) {
            if (!code.includes(varName)) return
            const filePathVite = getFilePathVite(id, config.root)
            const errMsgAddendum = isBuild
              ? ''
              : ' (vite-plugin-ssr will prevent your app from building for production)'
            const errMsg =
              `${varName} used in ${filePathVite} and therefore included in client-side bundle which can be be a security leak${errMsgAddendum}, remove ${varName} or rename ${key} to ${keyPublic}, see https://vite-plugin-ssr.com/env` as const
            if (isBuild) {
              assertUsage(false, errMsg)
            } else {
              // Only a warning for faster development DX (e.g. when use toggles `ssr: boolean` or `onBeforeRenderIsomorph: boolean`)
              assertWarning(false, errMsg, { onlyOnce: true })
            }
          }
          assert(!(isPrivate && isClientSide) || !isBuild)
          code = code.replaceAll(varName, JSON.stringify(val))
        })

      // No need for low-resolution source map since line numbers didn't change. (Does Vite do high-resolution column numbers source mapping?)
      return code
    }
  }
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
