export { resolveVikeConfig }

import type { Plugin, ResolvedConfig } from 'vite'
import type { ConfigVikeUserProvided, ConfigVikeResolved } from '../../../../shared/ConfigVike.js'
import { assertVikeConfig } from './assertVikeConfig.js'
import { assert, isDevCheck } from '../../utils.js'
import { pickFirst } from './pickFirst.js'
import { resolveBase } from './resolveBase.js'
import { getVikeConfig } from '../importUserCode/v1-design/getVikeConfig.js'
import pc from '@brillout/picocolors'

function resolveVikeConfig(vikeConfig: unknown): Plugin {
  let isDev: undefined | boolean
  return {
    name: 'vike:resolveVikeConfig',
    enforce: 'pre',
    apply(_config, env) {
      isDev = isDevCheck(env)
      return true
    },
    async configResolved(config) {
      assert(typeof isDev === 'boolean')
      const promise = getConfigVikPromise(vikeConfig, config, isDev)
      ;(config as Record<string, unknown>).configVikePromise = promise
      await promise
    }
  }
}

async function getConfigVikPromise(
  vikeConfig: unknown,
  config: ResolvedConfig,
  isDev: boolean
): Promise<ConfigVikeResolved> {
  const fromPluginOptions = (vikeConfig ?? {}) as ConfigVikeUserProvided

  const configs = [fromPluginOptions]
  // TODO/v1-release: deprecate this
  assertVikeConfig(fromPluginOptions, ({ prop, errMsg }) => `vite.config.js > vike option ${prop} ${errMsg}`)

  const crawlWithGit = fromPluginOptions.crawl?.git ?? null
  const { globalVikeConfig: fromPlusConfigFile } = await getVikeConfig(config, isDev, { crawlWithGit })
  configs.push(fromPlusConfigFile)
  assertVikeConfig(fromPlusConfigFile, ({ prop, errMsg }) => {
    // TODO: add config file path ?
    return `config ${pc.cyan(prop)} ${errMsg}`
  })

  const { baseServer, baseAssets } = resolveBase(configs, config)

  const configVike: ConfigVikeResolved = {
    disableAutoFullBuild: pickFirst(configs.map((c) => c.disableAutoFullBuild)) ?? null,
    prerender: resolvePrerenderOptions(configs),
    includeAssetsImportedByServer: pickFirst(configs.map((c) => c.includeAssetsImportedByServer)) ?? true,
    baseServer,
    baseAssets,
    redirects: merge(configs.map((c) => c.redirects)) ?? {},
    disableUrlNormalization: pickFirst(configs.map((c) => c.disableUrlNormalization)) ?? false,
    trailingSlash: pickFirst(configs.map((c) => c.trailingSlash)) ?? false,
    crawl: {
      git: crawlWithGit
    }
  }

  return configVike
}

function resolvePrerenderOptions(configs: ConfigVikeUserProvided[]): ConfigVikeResolved['prerender'] {
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
