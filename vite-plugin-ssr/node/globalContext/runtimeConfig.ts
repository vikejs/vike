import { assert, assertBaseUrl } from '../utils'

export { getRuntimeConfig }
export { setRuntimeConfig }
export { resolveRuntimeConfig }
export type { RuntimeConfig }

type RuntimeConfig = {
  baseUrl: string
  baseAssets: string | null
}
let runtimeConfig: null | RuntimeConfig = null
function setRuntimeConfig(runtimeConfig_: RuntimeConfig) {
  assert(runtimeConfig_)
  runtimeConfig = runtimeConfig_
  assertBaseUrl(runtimeConfig.baseUrl)
}
function getRuntimeConfig() {
  assert(runtimeConfig)
  return runtimeConfig
}
function resolveRuntimeConfig(viteConfig: { base: string }) {
  const { baseUrl, baseAssets } = resolveBase(viteConfig.base)
  const runtimeConfig = {
    baseUrl,
    baseAssets,
  }
  return runtimeConfig
}
function resolveBase(base: string) {
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
