export { resolveVikeConfig }
export { resolveVikeConfigGlobal } // TODO: move?

import type { Plugin, ResolvedConfig, UserConfig } from 'vite'
import type { ConfigVikeUserProvided, ConfigVikeResolved } from '../../../../shared/ConfigVike.js'
import { assertVikeConfig } from './assertVikeConfig.js'
import { assert, isDevCheck } from '../../utils.js'
import { pickFirst } from './pickFirst.js'
import { resolveBaseFromResolvedConfig } from './resolveBase.js'
import { getVikeConfig } from '../importUserCode/v1-design/getVikeConfig.js'
import pc from '@brillout/picocolors'

function resolveVikeConfig(vikeVitePluginOptions: unknown = {}): Plugin {
  let isDev: undefined | boolean
  return {
    name: 'vike:resolveVikeConfig',
    enforce: 'pre',
    apply(_config, env) {
      isDev = isDevCheck(env)
      return true
    },
    config() {
      return {
        _vikeVitePluginOptions: vikeVitePluginOptions
      } as UserConfig
    },
    async configResolved(config) {
      assert(typeof isDev === 'boolean')
      const promise = getConfigVikPromise(vikeVitePluginOptions, config, isDev)
      ;(config as Record<string, unknown>).configVikePromise = promise
      await promise
    }
  }
}

async function getConfigVikPromise(
  vikeVitePluginOptions: unknown,
  config: ResolvedConfig,
  isDev: boolean
): Promise<ConfigVikeResolved> {
  const { vikeConfigGlobal } = await getVikeConfig(config, isDev, {
    vikeVitePluginOptions
  })
  return vikeConfigGlobal
}

function resolveVikeConfigGlobal(
  vikeVitePluginOptions: unknown,
  pageConfigGlobalValues: Record<string, unknown>
): ConfigVikeResolved {
  // TODO/v1-release: deprecate this
  assertVikeConfig(vikeVitePluginOptions, ({ prop, errMsg }) => `vite.config.js > vike option ${prop} ${errMsg}`)
  const configs = [vikeVitePluginOptions]

  assertVikeConfig(pageConfigGlobalValues, ({ prop, errMsg }) => {
    // TODO: add config file path ?
    return `config ${pc.cyan(prop)} ${errMsg}`
  })
  configs.push(pageConfigGlobalValues)

  /* TODO
  const { baseServer, baseAssets } = resolveBase(configs)
  /*/
  const baseServer = '/'
  const baseAssets = '/'
  //*/

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
      git: vikeVitePluginOptions.crawl?.git ?? null
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
