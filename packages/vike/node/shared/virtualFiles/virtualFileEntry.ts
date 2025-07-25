export { virtualFileIdEntryServer }
export { virtualFileIdEntryClientSR }
export { virtualFileIdEntryClientCR }
export { isVirtualFileIdEntry }

import { assert, assertIsNotBrowser } from '../utils.js'
import { removeVirtualFileIdPrefix } from '../../../utils/virtualFileId.js'
assertIsNotBrowser()

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
