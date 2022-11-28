export { getRuntimeConfig }
export { setRuntimeConfig }
export { resolveRuntimeConfig }
export type { RuntimeConfig }

import { assert, assertBaseUrl, getGlobalObject } from '../utils'
import { assertBaseRuntime, assertBaseConfig } from './runtimeConfig/assertBase'
import type { ConfigVpsResolved } from '.././plugin/plugins/config/ConfigVps'
import { ResolvedConfig } from 'vite'
const globalObject = getGlobalObject<{ runtimeConfig?: RuntimeConfig }>('runtimeConfig.ts', {})

type RuntimeConfig = {
  baseUrl: string
  baseAssets: string | null
  includeAssetsImportedByServer: boolean
}

function setRuntimeConfig(runtimeConfig: RuntimeConfig): void {
  assert(runtimeConfig)
  assertBaseRuntime(runtimeConfig)
  assert(typeof runtimeConfig.includeAssetsImportedByServer === 'boolean')
  assertBaseUrl(runtimeConfig.baseUrl)
  globalObject.runtimeConfig = runtimeConfig
}
function getRuntimeConfig(): RuntimeConfig {
  const { runtimeConfig } = globalObject
  assert(runtimeConfig)
  assertBaseRuntime(runtimeConfig)
  return runtimeConfig
}
function resolveRuntimeConfig(config: ResolvedConfig, configVps: ConfigVpsResolved): RuntimeConfig {
  const { baseUrl, baseAssets } = resolveBase(config.base)
  const { includeAssetsImportedByServer } = configVps
  const runtimeConfig = {
    baseUrl,
    baseAssets,
    includeAssetsImportedByServer
  }
  return runtimeConfig
}
function resolveBase(base: string) {
  assertBaseConfig(base)
  let baseUrl = '/'
  let baseAssets = null
  assert(base)
  if (base.startsWith('http')) {
    baseAssets = base
  } else {
    baseUrl = base
  }
  return {
    baseUrl,
    baseAssets
  }
}
