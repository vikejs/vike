export { resolveVpsConfig }

import type { Plugin } from 'vite'
import type { ConfigVpsUserProvided, ConfigVpsResolved } from './config/ConfigVps'
import { checkConfigVps } from './config/assertConfigVps'
import { assert, assertUsage } from '../utils'
import { findConfigVpsFromStemPackages } from './config/findConfigVpsFromStemPackages'

function resolveVpsConfig(vpsConfig: unknown) {
  return {
    name: 'vite-plugin-ssr:resolveVpsConfig',
    enforce: 'pre',
    async configResolved(config) {
      const configVpsPromise = resolveConfigVps(
        (vpsConfig ?? {}) as ConfigVpsUserProvided,
        ((config as Record<string, unknown>).vitePluginSsr ?? {}) as ConfigVpsUserProvided,
        config.root
      )
      ;(config as Record<string, unknown>).configVpsPromise = configVpsPromise
    }
  } as Plugin
}

async function resolveConfigVps(
  fromPluginOptions: ConfigVpsUserProvided,
  fromViteConfig: ConfigVpsUserProvided,
  root: string
): Promise<ConfigVpsResolved> {
  {
    const validationErr = checkConfigVps(fromPluginOptions)
    if (validationErr)
      assertUsage(false, `vite.config.js > vite-plugin-ssr option ${validationErr.prop} ${validationErr.errMsg}`)
  }
  {
    const validationErr = checkConfigVps(fromViteConfig)
    if (validationErr) assertUsage(false, `vite.config.js#vitePluginSsr.${validationErr.prop} ${validationErr.errMsg}`)
  }
  const fromStemPackages = await findConfigVpsFromStemPackages(root)
  const configs = [fromPluginOptions, ...fromStemPackages, fromViteConfig]

  const configVps: ConfigVpsResolved = {
    disableAutoFullBuild: pickFirst(configs.map((c) => c.disableAutoFullBuild)) ?? false,
    pageFiles: {
      include: configs.map((c) => c.pageFiles?.include ?? []).flat(),
      addPageFiles: configs.map((c) => c.pageFiles?.addPageFiles ?? []).flat()
    },
    prerender: resolvePrerenderOptions(configs),
    includeCSS: configs.map((c) => c.includeCSS ?? []).flat(),
    includeAssetsImportedByServer: pickFirst(configs.map((c) => c.includeAssetsImportedByServer)) ?? false
  }

  assert(checkConfigVps(configVps) === null)
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

function pickFirst<T>(arr: T[]): T | undefined {
  return arr.filter((v) => v !== undefined)[0]
}

function isObject<T>(p: T | boolean | undefined): p is T {
  return typeof p === 'object'
}
