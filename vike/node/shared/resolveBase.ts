export { resolveBaseFromResolvedConfig }
export { resolveBaseFromUserConfig }

// TODO: move to runtime/ and move config helpers to base plugin

import { assert, assertUsage, isBaseServer, isBaseAssets } from '../runtime/utils.js'
import type { ResolvedConfig, UserConfig } from 'vite'
import type { ConfigVikeUserProvided } from '../../shared/ConfigVike.js'
import pc from '@brillout/picocolors'

type BaseServers = {
  baseServer: string
  baseAssets: string
}

function resolveBaseFromResolvedConfig(
  baseServer: string | null,
  baseAssets: string | null,
  config: ResolvedConfig
): BaseServers {
  let baseViteOriginal: unknown = (config as Record<string, unknown>)._baseViteOriginal
  if (baseViteOriginal === '/__UNSET__') baseViteOriginal = null
  assert(baseViteOriginal === null || typeof baseViteOriginal == 'string')
  return resolveBase(baseViteOriginal, baseServer, baseAssets)
}

function resolveBaseFromUserConfig(
  config: UserConfig,
  vikeVitePluginOptions: undefined | ConfigVikeUserProvided
): BaseServers {
  const baseViteOriginal = config.base ?? null
  return resolveBase(
    baseViteOriginal,
    vikeVitePluginOptions?.baseServer ?? null,
    vikeVitePluginOptions?.baseAssets ?? null
  )
}

// TODO: rename return values
function resolveBase(
  baseViteOriginal: string | null,
  baseServerUnresolved: string | null,
  baseAssetsUnresolved: string | null
): BaseServers {
  {
    const wrongBase = (val: string) =>
      `should start with ${pc.cyan('/')}, ${pc.cyan('http://')}, or ${pc.cyan('https://')} (it's ${pc.cyan(
        val
      )} instead)`
    assertUsage(
      baseViteOriginal === null || isBaseAssets(baseViteOriginal),
      `vite.config.js#base ${wrongBase(baseViteOriginal!)}`
    )
    assertUsage(
      baseAssetsUnresolved === null || isBaseAssets(baseAssetsUnresolved),
      `Config ${pc.cyan('baseAssets')} ${wrongBase(baseAssetsUnresolved!)}`
    )
    assertUsage(
      baseServerUnresolved === null || baseServerUnresolved.startsWith('/'),
      `Config ${pc.cyan('baseServer')} should start with a leading slash ${pc.cyan('/')} (it's ${pc.cyan(
        String(baseServerUnresolved)
      )} instead)`
    )
  }
  if (baseViteOriginal) {
    if (baseViteOriginal.startsWith('http')) {
      baseAssetsUnresolved = baseAssetsUnresolved ?? baseViteOriginal
    } else {
      baseAssetsUnresolved = baseAssetsUnresolved ?? baseViteOriginal
      baseServerUnresolved = baseServerUnresolved ?? baseViteOriginal
    }
  }
  const baseServer = baseServerUnresolved ?? '/'
  const baseAssets = baseAssetsUnresolved ?? '/'
  assert(isBaseAssets(baseAssets))
  assert(isBaseServer(baseServer))
  return {
    baseServer,
    baseAssets
  }
}
