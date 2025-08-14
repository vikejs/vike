export { isRuntimeEnvMatch }

import type { ConfigEnvInternal } from '../../../../types/PageConfig.js'
import { assert } from '../../utils.js'

type RuntimeEnv = { isForClientSide: boolean; isClientRouting: boolean; isDev?: boolean }

function isRuntimeEnvMatch(configEnv: ConfigEnvInternal, runtime: RuntimeEnv): boolean {
  // Runtime
  if (!runtime.isForClientSide) {
    if (!configEnv.server) return false
  } else {
    if (!configEnv.client) return false
    if (configEnv.client === 'if-client-routing' && !runtime.isClientRouting) return false
  }

  // Production/development
  if (configEnv.production !== undefined) {
    assert(typeof configEnv.production === 'boolean')
    assert(typeof runtime.isDev === 'boolean')
    if (configEnv.production) {
      if (runtime.isDev) return false
    } else {
      if (!runtime.isDev) return false
    }
  }

  return true
}
