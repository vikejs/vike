export { isRuntimeEnvMatch }

import type { ConfigEnvInternal } from '../../../../../shared/page-configs/PageConfig.js'

function isRuntimeEnvMatch(
  configEnv: ConfigEnvInternal,
  runtime: { isForClientSide: boolean; isClientRouting: boolean; isEager: boolean; isDev: boolean }
): boolean {
  // Runtime
  if (!runtime.isForClientSide) {
    if (!configEnv.server) return false
  } else {
    if (!configEnv.client) return false
    if (configEnv.client === 'if-client-routing' && !runtime.isClientRouting) return false
  }

  // Eager
  if (runtime.isEager !== !!configEnv.eager) return false

  // Production/development
  if (
    //
    (configEnv.production === true && runtime.isDev) ||
    (configEnv.production === false && !runtime.isDev)
  )
    return false

  return true
}
