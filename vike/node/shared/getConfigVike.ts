export { getConfigVike }

import { ResolvedConfig } from 'vite'
import type { ConfigVikeResolved } from '../../shared/ConfigVike.js'
import { assert } from './utils.js'

async function getConfigVike(config: ResolvedConfig): Promise<ConfigVikeResolved> {
  const { configVikePromise } = config as any
  assert(configVikePromise)
  const configVike: ConfigVikeResolved = await configVikePromise
  return configVike
}
