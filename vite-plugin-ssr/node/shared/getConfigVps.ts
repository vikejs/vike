export { getConfigVps }

import type { ConfigVpsResolved } from '../../shared/ConfigVps.js'

async function getConfigVps(config: Record<string, unknown>): Promise<ConfigVpsResolved> {
  const configVps: ConfigVpsResolved = (await config.configVpsPromise) as any
  return configVps
}
