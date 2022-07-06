export { resolveVpsConfig }

import { assertVpsConfig } from './assertConfig'
import type { ConfigVpsResolved, ConfigVpsUser } from './ConfigVps'

function resolveVpsConfig(fromPluginOptions: unknown, fromViteConfig: unknown): ConfigVpsResolved {
  assertUserInputFromPluginOptions(fromPluginOptions)
  assertUserInputFromViteConfig(fromViteConfig)

  const vitePluginSsr: ConfigVpsResolved = {
    disableBuildChaining: fromPluginOptions.disableBuildChaining ?? fromViteConfig.disableBuildChaining ?? false,
    pageFiles: {
      include: [...(fromPluginOptions.pageFiles?.include ?? []), ...(fromViteConfig.pageFiles?.include ?? [])],
    },
    prerender: resolvePrerenderOptions(fromPluginOptions, fromViteConfig),
    includeCSS: fromPluginOptions.includeCSS ?? fromViteConfig.includeCSS ?? [],
    includeAssetsImportedByServer: fromPluginOptions.includeAssetsImportedByServer ?? fromViteConfig.includeAssetsImportedByServer ?? false,
  }

  assertVpsConfig(vitePluginSsr, null)
  return vitePluginSsr
}

function resolvePrerenderOptions(fromPluginOptions: ConfigVpsUser, fromViteConfig: ConfigVpsUser) {
  let prerender: ConfigVpsResolved['prerender'] = false

  if (fromPluginOptions.prerender || fromViteConfig.prerender) {
    const prerenderUserOptions =
      typeof fromPluginOptions.prerender === 'boolean' ? {} : fromPluginOptions.prerender ?? {}
    const prerenderViteConfig = typeof fromViteConfig.prerender === 'boolean' ? {} : fromViteConfig.prerender ?? {}
    prerender = {
      partial: prerenderUserOptions.partial ?? prerenderViteConfig.partial ?? false,
      noExtraDir: prerenderUserOptions.noExtraDir ?? prerenderViteConfig.noExtraDir ?? false,
      parallel: prerenderUserOptions.parallel ?? prerenderViteConfig.parallel ?? true,
    }
  }
  return prerender
}

function assertUserInputFromPluginOptions(fromPluginOptions: unknown): asserts fromPluginOptions is ConfigVpsUser {
  assertVpsConfig(
    fromPluginOptions,
    ({ configPathInObject, configProp }) =>
      `[vite.config.js][ssr({ ${configPathInObject} })] Configuration \`${configProp}\``,
  )
}
function assertUserInputFromViteConfig(fromViteConfig: unknown): asserts fromViteConfig is ConfigVpsUser {
  assertVpsConfig(fromViteConfig, ({ configPath }) => `vite.config.js#vitePluginSsr.${configPath}`)
}
