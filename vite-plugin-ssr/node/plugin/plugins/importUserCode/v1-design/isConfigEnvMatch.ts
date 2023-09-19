export { isConfigEnvMatch }

import type { ConfigEnvInternal } from '../../../../../shared/page-configs/PageConfig.js'

function isConfigEnvMatch(configEnv: ConfigEnvInternal, isForClientSide: boolean, isClientRouting: boolean) {
  if (configEnv === '_routing-eager' || configEnv === 'config-only') return false
  if (configEnv === (isForClientSide ? 'server-only' : 'client-only')) return false
  if (configEnv === '_routing-lazy' && isForClientSide && !isClientRouting) return false
  return true
}
