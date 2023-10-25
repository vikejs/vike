export { isRuntimeEnvMatch }

import type { ConfigEnvInternal } from '../../../../../shared/page-configs/PageConfig.js'

function isRuntimeEnvMatch(
  configEnv: ConfigEnvInternal,
  runtime: { isForClientSide: boolean; isClientRouting: boolean }
) {
  const { isForClientSide, isClientRouting } = runtime
  if (configEnv === '_routing-eager' || configEnv === 'config-only') return false
  if (configEnv === (isForClientSide ? 'server-only' : 'client-only')) return false
  if (configEnv === '_routing-lazy' && isForClientSide && !isClientRouting) return false
  return true
}
