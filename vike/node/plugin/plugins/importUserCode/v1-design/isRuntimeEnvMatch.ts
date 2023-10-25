export { isRuntimeEnvMatch }

import type { ConfigEnvInternal } from '../../../../../shared/page-configs/PageConfig.js'

function isRuntimeEnvMatch(
  configEnv: ConfigEnvInternal,
  runtime: { isForClientSide: boolean; isClientRouting: boolean; isEager: boolean }
): boolean {
  const { isForClientSide, isClientRouting, isEager } = runtime
  if (configEnv === 'config-only') return false
  if (configEnv === (isForClientSide ? 'server-only' : 'client-only')) return false
  if (configEnv === '_routing-eager' || configEnv === '_routing-lazy') {
    if (isForClientSide && !isClientRouting) return false
    if (isEager !== (configEnv === '_routing-eager')) return false
  }
  return true
}
