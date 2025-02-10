export { resolveBase }
export { resolveBaseRuntime }
export { resolveBaseFromResolvedConfig }

import { assert, assertUsage, isBaseServer, isBaseAssets } from './utils.js'
import pc from '@brillout/picocolors'
import type { ResolvedConfig } from 'vite'
import { getGlobalContext, GlobalContext } from '../runtime/globalContext.js'

function resolveBaseFromResolvedConfig(
  baseServer: string | null,
  baseAssets: string | null,
  config: ResolvedConfig
): {
  baseServer: string
  baseAssets: string
} {
  let baseViteOriginal: unknown = (config as Record<string, unknown>)._baseViteOriginal
  assert(baseViteOriginal === null || typeof baseViteOriginal == 'string')
  return resolveBase(baseViteOriginal, baseServer, baseAssets)
}

type BaseUrlsResolved = {
  baseServer: string
  baseAssets: string
}

function resolveBaseRuntime(globalContext: GlobalContext) {
  const baseViteOriginal = globalContext.viteConfigRuntime._baseViteOriginal
  const baseServerUnresolved = globalContext.config.baseServer ?? null
  const baseAssetsUnresolved = globalContext.config.baseAssets ?? null
  return resolveBase(baseViteOriginal, baseServerUnresolved, baseAssetsUnresolved)
}

function resolveBase(
  baseViteOriginal: string | null,
  baseServerUnresolved: string | null,
  baseAssetsUnresolved: string | null
): BaseUrlsResolved {
  if (baseViteOriginal === '/__UNSET__') baseViteOriginal = null
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
