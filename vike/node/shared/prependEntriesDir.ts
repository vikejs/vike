export { prependEntriesDir }

import { assert } from './utils.js'

function prependEntriesDir(entryName: string): string {
  if (entryName.startsWith('/')) {
    entryName = entryName.slice(1)
  }
  assert(!entryName.startsWith('/'))
  entryName = `entries/${entryName}`
  return entryName
}
