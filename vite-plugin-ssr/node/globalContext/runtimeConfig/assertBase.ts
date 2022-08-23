import { assertUsage } from '../../utils'
import type { RuntimeConfig } from '../runtimeConfig'

export { assertBaseRuntime }
export { assertBaseConfig }
export { assertBaseUrlValue }

const errMsg = "vite.config.js#base should start with '/', 'http://', or 'https://'"

function assertBaseRuntime(runtimeConfig: RuntimeConfig) {
  const { baseUrl, baseAssets } = runtimeConfig
  assertUsage(
    baseUrl.startsWith('/') &&
      (baseAssets === null || baseAssets.startsWith('http://') || baseAssets.startsWith('https://')),
    errMsg
  )
}

function assertBaseConfig(base: string) {
  assertUsage(base.startsWith('/') || base.startsWith('http://') || base.startsWith('https://'), errMsg)
}

function assertBaseUrlValue(baseUrl: string) {
  assertUsage(baseUrl.startsWith('/'), errMsg)
}
