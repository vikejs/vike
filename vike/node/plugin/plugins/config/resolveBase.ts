export { resolveBase }
export { resolveBaseFromUserConfig }

import { assert, assertUsage, isBaseServer, isBaseAssets } from '../../utils.js'
import type { ResolvedConfig, UserConfig } from 'vite'
import type { ConfigVikeUserProvided } from '../../../../shared/ConfigVike.js'
import { pickFirst } from './pickFirst.js'
import pc from '@brillout/picocolors'

type BaseServers = {
  baseServer: string
  baseAssets: string
}

function resolveBase(configs: ConfigVikeUserProvided[], config: ResolvedConfig): BaseServers {
  const baseServer = pickFirst(configs.map((c) => c.baseServer)) ?? null
  const baseAssets = pickFirst(configs.map((c) => c.baseAssets)) ?? null
  let baseOriginal: unknown = (config as Record<string, unknown>)._baseOriginal
  if (baseOriginal === '/__UNSET__') baseOriginal = null
  assert(baseOriginal === null || typeof baseOriginal == 'string')
  return resolve(baseOriginal, baseServer, baseAssets)
}

function resolveBaseFromUserConfig(config: UserConfig, configVike: undefined | ConfigVikeUserProvided): BaseServers {
  return resolve(config.base ?? null, configVike?.baseServer ?? null, configVike?.baseAssets ?? null)
}

function resolve(base: string | null, baseServer_: string | null, baseAssets_: string | null): BaseServers {
  {
    const wrongBase = (val: string) =>
      `should start with ${pc.cyan('/')}, ${pc.cyan('http://')}, or ${pc.cyan('https://')} (it's ${pc.cyan(
        val
      )} instead)`
    assertUsage(base === null || isBaseAssets(base), `vite.config.js#base ${wrongBase(base!)}`)
    assertUsage(
      baseAssets_ === null || isBaseAssets(baseAssets_),
      `Config ${pc.cyan('baseAssets')} ${wrongBase(baseAssets_!)}`
    )
    assertUsage(
      baseServer_ === null || baseServer_.startsWith('/'),
      `Config ${pc.cyan('baseServer')} should start with a leading slash ${pc.cyan('/')} (it's ${pc.cyan(
        String(baseServer_)
      )} instead)`
    )
  }
  if (base) {
    if (base.startsWith('http')) {
      baseAssets_ = baseAssets_ ?? base
    } else {
      baseAssets_ = baseAssets_ ?? base
      baseServer_ = baseServer_ ?? base
    }
  }
  const baseServer = baseServer_ ?? '/'
  const baseAssets = baseAssets_ ?? '/'
  assert(isBaseAssets(baseAssets))
  assert(isBaseServer(baseServer))
  return {
    baseServer,
    baseAssets
  }
}
