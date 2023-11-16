export { isRuntimeEnvMatch }

import type { ConfigEnvInternal } from '../../../../../shared/page-configs/PageConfig.js'

function isRuntimeEnvMatch(
  configEnv: ConfigEnvInternal,
  runtime: { isForClientSide: boolean; isClientRouting: boolean; isEager: boolean }
): boolean {
  // Target
  if (!runtime.isForClientSide) {
    if (!configEnv.server) return false
  } else {
    if (!configEnv.client) return false
    if (configEnv.client === '_client-routing' && !runtime.isClientRouting) return false
  }

  // TODO: always apply eager value
  // Eager
  if (configEnv.client === '_client-routing') {
    if (runtime.isEager !== !!configEnv._eager) return false
  }

  return true
}
