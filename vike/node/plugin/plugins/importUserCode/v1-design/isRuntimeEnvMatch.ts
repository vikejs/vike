export { isRuntimeEnvMatch }

import type { ConfigEnvInternal } from '../../../../../shared/page-configs/PageConfig.js'

function isRuntimeEnvMatch(
  configEnv: ConfigEnvInternal,
  runtime: { isForClientSide: boolean; isClientRouting: boolean; isEager: boolean }
): boolean {
  const { isForClientSide, isClientRouting, isEager } = runtime
  if (configEnv === { config: true }) return false
  if (configEnv === (isForClientSide ? { server: true } : { client: true })) return false
  if (configEnv === { server: true, client: '_client-routing', _eager: true } || configEnv === { server: true, client: '_client-routing' }) {
    if (isForClientSide && !isClientRouting) return false
    if (isEager !== (configEnv === { server: true, client: '_client-routing', _eager: true })) return false
  }
  return true
}
