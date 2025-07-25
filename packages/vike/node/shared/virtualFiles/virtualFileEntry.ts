export { virtualFileIdEntryServer }
export { virtualFileIdEntryClientSR }
export { virtualFileIdEntryClientCR }
export { isVirtualFileIdEntry }

// TODO/now: merge virtualFileEntry.ts and virtualFilePageConfigLazy.ts
// - One function parseVirtualFileIdEntry() to rule them all?

import { assert, assertIsNotBrowser, removeVirtualFileIdPrefix } from '../utils.js'
assertIsNotBrowser()

// TODO/now: rename:
// ```diff
// - virtual:vike:entry:server
// + virtual:vike:entry:global:server
// ```
const virtualFileIdEntryServer = 'virtual:vike:entry:server'
const virtualFileIdEntryClientSR = 'virtual:vike:entry:client:server-routing'
const virtualFileIdEntryClientCR = 'virtual:vike:entry:client:client-routing'
const virtualFileIdEntries = [virtualFileIdEntryServer, virtualFileIdEntryClientCR, virtualFileIdEntryClientSR]
const idBase = 'virtual:vike:entry'
assert(virtualFileIdEntries.every((v) => v.startsWith(`${idBase}:`)))

function isVirtualFileIdEntry(id: string): false | { isForClientSide: boolean; isClientRouting: boolean } {
  id = removeVirtualFileIdPrefix(id)
  if (!id.startsWith(idBase)) return false
  assert(virtualFileIdEntries.includes(id))
  const isForClientSide = id !== virtualFileIdEntryServer
  const isClientRouting = id === virtualFileIdEntryClientCR
  return { isForClientSide, isClientRouting }
}
