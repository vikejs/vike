export { virtualFileIdEntryServer }
export { virtualFileIdEntryClientSR }
export { virtualFileIdEntryClientCR }
export { isVirtualFileIdEntry }

import { assert } from '../utils.js'
import { getVirtualFileId } from '../virtualFiles.js'

const idBase = 'virtual:vike:importUserCode'
const virtualFileIdEntryServer = `${idBase}:server`
const virtualFileIdEntryClientSR = `${idBase}:client:server-routing`
const virtualFileIdEntryClientCR = `${idBase}:client:client-routing`

function isVirtualFileIdEntry(id: string): false | { isForClientSide: boolean; isClientRouting: boolean } {
  id = getVirtualFileId(id)
  if (!id.startsWith(idBase)) return false
  assert(
    // prettier-ignore
    // biome-ignore format:
    [
      virtualFileIdEntryServer,
      virtualFileIdEntryClientCR,
      virtualFileIdEntryClientSR
    ].includes(id)
  )
  const isForClientSide = id !== virtualFileIdEntryServer
  const isClientRouting = id === virtualFileIdEntryClientCR
  return { isForClientSide, isClientRouting }
}
