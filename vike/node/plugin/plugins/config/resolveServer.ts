export { resolveServerConfig }

import type { ConfigVikeUserProvided, ServerResolved } from '../../../../shared/ConfigVike.js'
import { assert, assertUsage } from '../../utils.js'

function resolveServerConfig(configVike?: ConfigVikeUserProvided): ServerResolved {
  if (!configVike?.server) {
    return undefined
  }

  if (typeof configVike.server === 'object') {
    if (configVike.server.entry) {
      assertUsage(
        typeof configVike.server.entry === 'string' ||
          (typeof configVike.server.entry === 'object' &&
            Object.entries(configVike.server.entry).every(([, value]) => typeof value === 'string')),
        'server.entry should be a string or an entry mapping { name: path }'
      )
      assertUsage(
        typeof configVike.server.entry !== 'object' ||
          Object.entries(configVike.server.entry).some(([name]) => name === 'index'),
        'missing index entry in server.entry'
      )
    }

    const entriesProvided =
      typeof configVike.server.entry === 'string' ? { index: configVike.server.entry } : configVike.server.entry

    assert('index' in entriesProvided)

    return {
      entry: entriesProvided
    }
  }

  assertUsage(typeof configVike.server === 'string', 'server should be a string')
  return { entry: { index: configVike.server } }
}
