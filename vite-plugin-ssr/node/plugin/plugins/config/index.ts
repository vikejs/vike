export { resolveVpsConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import type { ConfigVpsUserProvided, ConfigVpsResolved } from '../../../../shared/ConfigVps'
import { assertVpsConfig } from './assertVpsConfig'
import { isDev2 } from '../../utils'
import { findConfigVpsFromStemPackages } from './findConfigVpsFromStemPackages'
import { pickFirst } from './pickFirst'
import { resolveExtensions } from './resolveExtensions'
import { resolveBase } from './resolveBase'
import { getConfigData } from '../importUserCode/v1-design/getConfigData'

function resolveVpsConfig(vpsConfig: unknown): Plugin {
  return {
    name: 'vite-plugin-ssr:resolveVpsConfig',
    enforce: 'pre',
    async configResolved(config) {
      const promise = resolveConfig(vpsConfig, config)
      ;(config as Record<string, unknown>).configVpsPromise = promise
      await promise
    }
  }
}

async function resolveConfig(vpsConfig: unknown, config: ResolvedConfig): Promise<ConfigVpsResolved> {
  const fromPluginOptions = (vpsConfig ?? {}) as ConfigVpsUserProvided
  const fromViteConfig = ((config as Record<string, unknown>).vitePluginSsr ?? {}) as ConfigVpsUserProvided
  const fromStemPackages = await findConfigVpsFromStemPackages(config.root)

  const configs = [fromPluginOptions, ...fromStemPackages, fromViteConfig]

  const extensions = resolveExtensions(configs, config)

  const { vikeConfig: fromPlusConfigFile } = await getConfigData(config.root, isDev2(config), false, extensions)
  configs.push(fromPlusConfigFile)

  assertVpsConfig(fromPlusConfigFile, ({ prop, errMsg }) => {
    // TODO: add config file path ?
    return `config '${prop}' ${errMsg}`
  })
  assertVpsConfig(fromViteConfig, ({ prop, errMsg }) => `vite.config.js#vitePluginSsr.${prop} ${errMsg}`)
  // TODO/v1-release: deprecate this
  assertVpsConfig(fromPluginOptions, ({ prop, errMsg }) => `vite.config.js > vite-plugin-ssr option ${prop} ${errMsg}`)

  const { baseServer, baseAssets } = resolveBase(configs, config)

  const configVps: ConfigVpsResolved = {
    disableAutoFullBuild: pickFirst(configs.map((c) => c.disableAutoFullBuild)) ?? false,
    extensions,
    prerender: resolvePrerenderOptions(configs),
    includeAssetsImportedByServer: pickFirst(configs.map((c) => c.includeAssetsImportedByServer)) ?? false,
    baseServer,
    baseAssets
  }

  return configVps
}

function resolvePrerenderOptions(configs: ConfigVpsUserProvided[]): ConfigVpsResolved['prerender'] {
  if (!configs.some((c) => c.prerender)) {
    return false
  }
  const configsPrerender = configs.map((c) => c.prerender).filter(isObject)
  return {
    partial: pickFirst(configsPrerender.map((c) => c.partial)) ?? false,
    noExtraDir: pickFirst(configsPrerender.map((c) => c.noExtraDir)) ?? false,
    parallel: pickFirst(configsPrerender.map((c) => c.parallel)) ?? true,
    disableAutoRun: pickFirst(configsPrerender.map((c) => c.disableAutoRun)) ?? false
  }
}

function isObject<T>(p: T | boolean | undefined): p is T {
  return typeof p === 'object'
}
