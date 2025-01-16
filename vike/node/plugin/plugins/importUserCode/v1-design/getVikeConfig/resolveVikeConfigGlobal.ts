export { resolveVikeConfigGlobal }
export type { ConfigVikeResolved }

import type { ConfigVikeUserProvided } from '../../../../../../shared/ConfigVike.js'
import pc from '@brillout/picocolors'
import { assert, assertUsage, hasProp, isObject } from '../../../../utils.js'

function resolveVikeConfigGlobal(
  vikeVitePluginOptions: unknown,
  pageConfigGlobalValues: Record<string, unknown>
): ConfigVikeResolved {
  // TODO/v1-release: remove
  assertVikeConfig(vikeVitePluginOptions, ({ prop, errMsg }) => `vite.config.js > vike option ${prop} ${errMsg}`)
  const configs = [vikeVitePluginOptions]

  assertVikeConfig(pageConfigGlobalValues, ({ prop, errMsg }) => {
    // Can we add the config file path ?
    return `config ${pc.cyan(prop)} ${errMsg}`
  })
  configs.push(pageConfigGlobalValues)

  const configVike: ConfigVikeResolved = {
    disableAutoFullBuild: pickFirst(configs.map((c) => c.disableAutoFullBuild)) ?? null,
    prerender: resolvePrerenderOptions(configs),
    includeAssetsImportedByServer: pickFirst(configs.map((c) => c.includeAssetsImportedByServer)) ?? true,
    baseServer: pickFirst(configs.map((c) => c.baseServer)) ?? null,
    baseAssets: pickFirst(configs.map((c) => c.baseAssets)) ?? null,
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
  const configsPrerender = configs.map((c) => c.prerender).filter(isObject2)
  return {
    partial: pickFirst(configsPrerender.map((c) => c.partial)) ?? false,
    noExtraDir: pickFirst(configsPrerender.map((c) => c.noExtraDir)) ?? false,
    parallel: pickFirst(configsPrerender.map((c) => c.parallel)) ?? true,
    disableAutoRun: pickFirst(configsPrerender.map((c) => c.disableAutoRun)) ?? false
  }
}

function isObject2<T>(p: T | boolean | undefined): p is T {
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

function pickFirst<T>(arr: T[]): T | undefined {
  return arr.filter((v) => v !== undefined)[0]
}

type WrongUsage = { prop: string; errMsg: `should be a${string}` }
function assertVikeConfig(
  vikeConfig: unknown,
  wrongUsageMsg: (wrongUsage: WrongUsage) => string
): asserts vikeConfig is ConfigVikeUserProvided {
  const wrongUsageError = checkConfigVike(vikeConfig)
  if (wrongUsageError) {
    assertUsage(false, wrongUsageMsg(wrongUsageError))
  }
}

function checkConfigVike(configVike: unknown): null | WrongUsage {
  assert(isObject(configVike))
  {
    const prop = 'disableUrlNormalization'
    if (!hasProp(configVike, prop, 'boolean') && !hasProp(configVike, prop, 'undefined'))
      return { prop, errMsg: 'should be a boolean' }
  }
  {
    const prop = 'trailingSlash'
    if (!hasProp(configVike, prop, 'boolean') && !hasProp(configVike, prop, 'undefined'))
      return { prop, errMsg: 'should be a boolean' }
  }
  {
    const prop = 'redirects'
    const { redirects } = configVike
    if (
      !(
        redirects === undefined ||
        (isObject(redirects) && Object.values(redirects).every((v) => typeof v === 'string'))
      )
    )
      return { prop, errMsg: 'should be an object of strings' }
  }
  {
    const prop = 'disableAutoFullBuild'
    if (
      !hasProp(configVike, prop, 'boolean') &&
      !hasProp(configVike, prop, 'undefined') &&
      !(configVike[prop] === 'prerender')
    )
      return { prop, errMsg: "should be a boolean or 'prerender'" }
  }
  {
    const prop = 'includeAssetsImportedByServer'
    if (!hasProp(configVike, prop, 'boolean') && !hasProp(configVike, prop, 'undefined'))
      return { prop, errMsg: 'should be a boolean' }
  }
  {
    const prop = 'prerender'
    if (
      !hasProp(configVike, prop, 'object') &&
      !hasProp(configVike, prop, 'boolean') &&
      !hasProp(configVike, prop, 'undefined')
    )
      return { prop, errMsg: 'should be an object or a boolean' }
  }

  const configVikePrerender = configVike.prerender
  if (typeof configVikePrerender === 'object') {
    {
      const p = 'partial'
      if (!hasProp(configVikePrerender, p, 'boolean') && !hasProp(configVikePrerender, p, 'undefined'))
        return { prop: `prerender.${p}`, errMsg: 'should be a boolean' }
    }
    {
      const p = 'noExtraDir'
      if (!hasProp(configVikePrerender, p, 'boolean') && !hasProp(configVikePrerender, p, 'undefined'))
        return { prop: `prerender.${p}`, errMsg: 'should be a boolean' }
    }
    {
      const p = 'disableAutoRun'
      if (!hasProp(configVikePrerender, p, 'boolean') && !hasProp(configVikePrerender, p, 'undefined'))
        return { prop: `prerender.${p}`, errMsg: 'should be a boolean' }
    }
    {
      const p = 'parallel'
      if (
        !hasProp(configVikePrerender, p, 'boolean') &&
        !hasProp(configVikePrerender, p, 'number') &&
        !hasProp(configVikePrerender, p, 'undefined')
      )
        return { prop: `prerender.${p}`, errMsg: 'should be a boolean or a number' }
    }
  }

  return null
}
// TODO: rename & move?
type ConfigVikeResolved = {
  prerender:
    | false
    | {
        noExtraDir: boolean
        parallel: boolean | number
        partial: boolean
        disableAutoRun: boolean
      }
  disableAutoFullBuild: boolean | 'prerender' | null
  includeAssetsImportedByServer: boolean
  baseAssets: string | null
  baseServer: string | null
  redirects: Record<string, string>
  trailingSlash: boolean
  disableUrlNormalization: boolean
  crawl: {
    git: null | boolean
  }
}
