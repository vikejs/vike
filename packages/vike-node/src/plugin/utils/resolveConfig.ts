export { resolveConfig }

import type { ConfigVikeNode, ConfigVikeNodeResolved, EntryResolved } from '../../types.js'
import { assertUsage } from '../../utils/assert.js'
import { unique } from './unique.js'

const nativeDependencies = ['sharp', '@prisma/client', '@node-rs/*']

function resolveConfig(configVike: ConfigVikeNode): ConfigVikeNodeResolved {
  if (typeof configVike.server === 'object') {
    if ('entry' in configVike.server) {
      assertUsage(
        typeof configVike.server.entry === 'string' ||
          (typeof configVike.server.entry === 'object' &&
            Object.entries(configVike.server.entry).every(
              ([, value]) => typeof value === 'string' || (typeof value === 'object' && 'entry' in value)
            )),
        'server.entry should be a string or an entry mapping { name: string | { entry: string } }'
      )
      assertUsage(
        typeof configVike.server.entry !== 'object' ||
          Object.entries(configVike.server.entry).some(([name]) => name === 'index'),
        'missing index entry in server.entry'
      )
    }

    const entriesProvided: EntryResolved =
      typeof configVike.server.entry === 'string'
        ? { index: { entry: configVike.server.entry } }
        : Object.entries(configVike.server.entry).reduce((acc, [name, value]) => {
            acc[name] = typeof value === 'string' ? { entry: value } : value
            return acc
          }, {} as EntryResolved)

    assertUsage('index' in entriesProvided, 'Missing index entry in server.entry')
    return {
      server: {
        entry: entriesProvided,
        standalone: configVike.server.standalone ?? false,
        external: unique([...nativeDependencies, ...(configVike.server.external ?? [])])
      }
    }
  }

  assertUsage(typeof configVike.server === 'string', 'config.server should be defined')
  return {
    server: {
      entry: { index: { entry: configVike.server } },
      standalone: false,
      external: nativeDependencies
    }
  }
}
