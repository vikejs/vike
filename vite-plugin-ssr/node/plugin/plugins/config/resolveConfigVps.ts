export { resolveConfigVps }

import { checkConfigVpsUserProvided, assertConfigVpsResolved } from './assertConfigVps'
import type { ConfigVpsResolved, ConfigVpsUserProvided } from './ConfigVps'
import { assertUsage } from '../../utils'

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
      includeDist: [...(fromPluginOptions.pageFiles?.includeDist ?? []), ...(fromViteConfig.pageFiles?.includeDist ?? [])]
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
