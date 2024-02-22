import { ConfigVikeNode, ConfigVikeNodeResolved } from '../../types.js'
import { assert, assertUsage } from '../../utils/assert.js'
import { unique } from './unique.js'

export { resolveConfig }

export const nativeDependecies = ['sharp', '@prisma/client', '@node-rs/*']

function resolveConfig(configVike: ConfigVikeNode): ConfigVikeNodeResolved {
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
      server: {
        entry: entriesProvided,
        standalone: configVike.server.standalone ?? false,
        native: unique([...nativeDependecies, ...(configVike.server.native ?? [])])
      }
    }
  }

  assertUsage(typeof configVike.server === 'string', 'config.server should be defined')
  return {
    server: {
      entry: { index: configVike.server },
      standalone: false,
      native: []
    }
  }
}
