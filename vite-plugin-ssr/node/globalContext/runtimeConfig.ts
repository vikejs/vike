import { assert, assertBaseUrl } from '../utils'
import { assertBaseRuntime, assertBaseConfig } from './runtimeConfig/assertBase'

export { getRuntimeConfig }
export { setRuntimeConfig }
export { resolveRuntimeConfig }
export type { RuntimeConfig }

type RuntimeConfig = {
  baseUrl: string
  baseAssets: string | null
  includeAssetsImportedByServer: boolean
}
let runtimeConfig: null | RuntimeConfig = null
function setRuntimeConfig(runtimeConfig_: RuntimeConfig) {
  assert(runtimeConfig_)
  assertBaseRuntime(runtimeConfig_)
  runtimeConfig = runtimeConfig_
  assert(typeof runtimeConfig.includeAssetsImportedByServer === 'boolean')
  assertBaseUrl(runtimeConfig.baseUrl)
}
function getRuntimeConfig() {
  assert(runtimeConfig)
  assertBaseRuntime(runtimeConfig)
  return runtimeConfig
}
function resolveRuntimeConfig(viteConfig: { base: string; vitePluginSsr: { includeAssetsImportedByServer: boolean } }) {
  const { baseUrl, baseAssets } = resolveBase(viteConfig.base)
  const { includeAssetsImportedByServer } = viteConfig.vitePluginSsr
  const runtimeConfig = {
    baseUrl,
    baseAssets,
    includeAssetsImportedByServer,
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
    baseAssets,
  }
}
