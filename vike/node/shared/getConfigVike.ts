export { getConfigVike }

import type { ConfigVikeResolved } from '../../shared/ConfigVike.js'

async function getConfigVike(config: Record<string, unknown>): Promise<ConfigVikeResolved> {
  const configVike: ConfigVikeResolved = (await config.configVikePromise) as any
  return configVike
}
