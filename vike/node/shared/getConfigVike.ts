export { getConfigVike }

import type { ConfigVikeResolved } from '../../shared/ConfigVike.js'
import { assert } from './utils.js'

async function getConfigVike(config: Record<string, unknown>): Promise<ConfigVikeResolved> {
  assert(config.configVikePromise)
  const configVike: ConfigVikeResolved = await (config.configVikePromise as any)
  return configVike
}
