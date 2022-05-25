export { resolveVpsConfig }

import { assertVpsConfig } from './assertConfig'
import type { VpsConfig } from './VpsConfig'

function resolveVpsConfig(fromPluginOptions: unknown, fromViteConfig: unknown): VpsConfig {
  assertUserInputFromPluginOptions(fromPluginOptions)
  assertUserInputFromViteConfig(fromViteConfig)

  const vitePluginSsr: VpsConfig = {
    disableBuildChaining: fromPluginOptions.disableBuildChaining ?? fromViteConfig.disableBuildChaining ?? false,
    buildOnlyPageFiles: fromPluginOptions.buildOnlyPageFiles ?? fromViteConfig.buildOnlyPageFiles ?? false,
    pageFiles: {
      include: [...(fromPluginOptions.pageFiles?.include ?? []), ...(fromViteConfig.pageFiles?.include ?? [])],
    },
    prerender: resolvePrerenderOptions(fromPluginOptions, fromViteConfig),
  }

  assertVpsConfig(vitePluginSsr, null)
  return vitePluginSsr
}

function resolvePrerenderOptions(fromPluginOptions: VpsConfig, fromViteConfig: VpsConfig) {
  let prerender: VpsConfig['prerender'] = false

  if (fromPluginOptions.prerender || fromViteConfig.prerender) {
    const prerenderUserOptions =
      typeof fromPluginOptions.prerender === 'boolean' ? {} : fromPluginOptions.prerender ?? {}
    const prerenderViteConfig = typeof fromViteConfig.prerender === 'boolean' ? {} : fromViteConfig.prerender ?? {}
    prerender = {
      partial: prerenderUserOptions.partial ?? prerenderViteConfig.partial ?? false,
      noExtraDir: prerenderUserOptions.noExtraDir ?? prerenderViteConfig.noExtraDir ?? false,
      parallel: prerenderUserOptions.parallel ?? prerenderViteConfig.parallel ?? undefined,
    }
  }
  return prerender
}

function assertUserInputFromPluginOptions(fromPluginOptions: unknown): asserts fromPluginOptions is VpsConfig {
  assertVpsConfig(
    fromPluginOptions,
    ({ configPathInObject, configProp }) =>
      `[vite.config.js][ssr({ ${configPathInObject} })] Configuration \`${configProp}\``,
  )
}
function assertUserInputFromViteConfig(fromViteConfig: unknown): asserts fromViteConfig is VpsConfig {
  assertVpsConfig(fromViteConfig, ({ configPath }) => `vite.config.js#vitePluginSsr.${configPath}`)
}
