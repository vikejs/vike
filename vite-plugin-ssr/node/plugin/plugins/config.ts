export { resolveVpsConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import type { ConfigVpsUserProvided, ConfigVpsResolved } from './config/ConfigVps'
import { assertVikeConfig } from './config/checkConfigVps'
import { assert, assertUsage, isDev2 } from '../utils'
import { findConfigVpsFromStemPackages } from './config/findConfigVpsFromStemPackages'
import { pickFirst } from './config/pickFirst'
import { resolveExtensions } from './config/resolveExtensions'
import { resolveBase } from './config/resolveBase'
import { loadPageConfigsData } from './virtualFiles/generatePageConfigsSourceCode/getPageConfigsData'

function resolveVpsConfig(vpsConfig: unknown): Plugin {
  return {
    name: 'vite-plugin-ssr:resolveVpsConfig',
    enforce: 'pre',
    configResolved(config) {
      ;(config as Record<string, unknown>).configVpsPromise = resolveConfig(vpsConfig, config)
    }
  }
}

async function resolveConfig(vpsConfig: unknown, config: ResolvedConfig): Promise<ConfigVpsResolved> {
  const fromPluginOptions = (vpsConfig ?? {}) as ConfigVpsUserProvided
  const fromViteConfig = ((config as Record<string, unknown>).vitePluginSsr ?? {}) as ConfigVpsUserProvided
  const { vikeConfig: fromPlusConfigFile, vikeConfigFilePath: fromPlusConfigFilePath } = await loadPageConfigsData(
    config.root,
    isDev2(config)
  )

  assertVikeConfig(fromPlusConfigFile, ({ prop, errMsg }) => {
    assert(fromPlusConfigFilePath)
    return `${fromPlusConfigFilePath} > ${prop} ${errMsg}`
  })
  assertVikeConfig(fromViteConfig, ({ prop, errMsg }) => `vite.config.js#vitePluginSsr.${prop} ${errMsg}`)
  // TODO/v1: deprecate this
  assertVikeConfig(fromPluginOptions, ({ prop, errMsg }) => `vite.config.js > vite-plugin-ssr option ${prop} ${errMsg}`)

  const fromStemPackages = await findConfigVpsFromStemPackages(config.root)
  const configs = [fromPluginOptions, ...fromStemPackages, fromViteConfig, fromPlusConfigFile]

  const { baseServer, baseAssets } = resolveBase(configs, config)

  const configVps: ConfigVpsResolved = {
    disableAutoFullBuild: pickFirst(configs.map((c) => c.disableAutoFullBuild)) ?? false,
    extensions: resolveExtensions(configs, config),
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
