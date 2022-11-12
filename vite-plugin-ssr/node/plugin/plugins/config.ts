export { setVitePluginSsrConfig }

import type { Plugin } from 'vite'
import type { ConfigVpsUserProvided, ConfigVpsResolved } from './config/ConfigVps'
import { checkConfigVpsUserProvided, assertConfigVpsResolved } from './config/assertConfigVps'
import { assertUsage } from '../utils'

function setVitePluginSsrConfig(vpsConfig: unknown) {
  return {
    name: 'vite-plugin-ssr:setVitePluginSsrConfig',
    enforce: 'pre',
    config(config) {
      const vitePluginSsr = resolveConfigVps(
        (vpsConfig ?? {}) as ConfigVpsUserProvided,
        ((config as Record<string, unknown>).vitePluginSsr ?? {}) as ConfigVpsUserProvided
      )
      return { vitePluginSsr }
    }
  } as Plugin
}

function resolveConfigVps(
  fromPluginOptions: ConfigVpsUserProvided,
  fromViteConfig: ConfigVpsUserProvided
): ConfigVpsResolved {
  {
    const validationErr = checkConfigVpsUserProvided(fromPluginOptions)
    if (validationErr)
      assertUsage(false, `vite.config.js > vite-plugin-ssr option ${validationErr.prop} ${validationErr.errMsg}`)
  }
  {
    const validationErr = checkConfigVpsUserProvided(fromViteConfig)
    if (validationErr) assertUsage(false, `vite.config.js#vitePluginSsr.${validationErr.prop} ${validationErr.errMsg}`)
  }

  const vitePluginSsr: ConfigVpsResolved = {
    disableAutoFullBuild: fromPluginOptions.disableAutoFullBuild ?? fromViteConfig.disableAutoFullBuild ?? false,
    pageFiles: {
      include: [...(fromPluginOptions.pageFiles?.include ?? []), ...(fromViteConfig.pageFiles?.include ?? [])],
      addPageFiles: [
        ...(fromPluginOptions.pageFiles?.addPageFiles ?? []),
        ...(fromViteConfig.pageFiles?.addPageFiles ?? [])
      ]
    },
    prerender: resolvePrerenderOptions(fromPluginOptions, fromViteConfig),
    includeCSS: fromPluginOptions.includeCSS ?? fromViteConfig.includeCSS ?? [],
    includeAssetsImportedByServer:
      fromPluginOptions.includeAssetsImportedByServer ?? fromViteConfig.includeAssetsImportedByServer ?? false
  }

  assertConfigVpsResolved({ vitePluginSsr })
  return vitePluginSsr
}

function resolvePrerenderOptions(fromPluginOptions: ConfigVpsUserProvided, fromViteConfig: ConfigVpsUserProvided) {
  let prerender: ConfigVpsResolved['prerender'] = false

  if (fromPluginOptions.prerender || fromViteConfig.prerender) {
    const prerenderUserOptions =
      typeof fromPluginOptions.prerender === 'boolean' ? {} : fromPluginOptions.prerender ?? {}
    const prerenderViteConfig = typeof fromViteConfig.prerender === 'boolean' ? {} : fromViteConfig.prerender ?? {}
    prerender = {
      partial: prerenderUserOptions.partial ?? prerenderViteConfig.partial ?? false,
      noExtraDir: prerenderUserOptions.noExtraDir ?? prerenderViteConfig.noExtraDir ?? false,
      parallel: prerenderUserOptions.parallel ?? prerenderViteConfig.parallel ?? true,
      disableAutoRun: prerenderUserOptions.disableAutoRun ?? prerenderViteConfig.disableAutoRun ?? false
    }
  }
  return prerender
}
