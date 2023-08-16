export { resolveVpsConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import type { ConfigVpsUserProvided, ConfigVpsResolved } from '../../../../shared/ConfigVps.js'
import { assertVpsConfig } from './assertVpsConfig.js'
import { isDev2 } from '../../utils.js'
import { findConfigVpsFromStemPackages } from './findConfigVpsFromStemPackages.js'
import { pickFirst } from './pickFirst.js'
import { resolveExtensions } from './resolveExtensions.js'
import { resolveBase } from './resolveBase.js'
import { getVikeConfig } from '../importUserCode/v1-design/getVikeConfig.js'

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

  const { globalVikeConfig: fromPlusConfigFile } = await getVikeConfig(config.root, isDev2(config), extensions)
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
    disableAutoFullBuild: pickFirst(configs.map((c) => c.disableAutoFullBuild)) ?? null,
    extensions,
    prerender: resolvePrerenderOptions(configs),
    includeAssetsImportedByServer: pickFirst(configs.map((c) => c.includeAssetsImportedByServer)) ?? true,
    baseServer,
    baseAssets,
    redirects: merge(configs.map((c) => c.redirects)) ?? {}
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

type Obj = Record<string, string>
function merge(objs: (Obj | undefined)[]): Obj {
  const obj: Record<string, string> = {}
  objs.forEach((e) => {
    Object.assign(obj, e)
  })
  return obj
}
