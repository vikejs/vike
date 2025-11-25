export { prependEntriesDir }

import { assert } from './utils.js'

function prependEntriesDir(entryName: string): string {
  if (entryName.startsWith('/')) {
    entryName = entryName.slice(1)
  }
  assert(!entryName.startsWith('/'))
  assert(entryName)
  entryName = `entries/${entryName}`
  return entryName
}
