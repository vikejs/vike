export { virtualFileIdImportUserCodeServer }
export { virtualFileIdImportUserCodeClientSR }
export { virtualFileIdImportUserCodeClientCR }
export { isVirtualFileIdImportUserCode }

import { assert } from '../utils.js'
import { getVirtualFileId } from '../virtualFiles.js'

const idBase = 'virtual:vike:importUserCode'
const virtualFileIdImportUserCodeServer = `${idBase}:server`
const virtualFileIdImportUserCodeClientSR = `${idBase}:client:server-routing`
const virtualFileIdImportUserCodeClientCR = `${idBase}:client:client-routing`

function isVirtualFileIdImportUserCode(id: string): false | { isForClientSide: boolean; isClientRouting: boolean } {
  id = getVirtualFileId(id)
  if (!id.startsWith(idBase)) return false
  assert(
    // prettier-ignore
    // biome-ignore format:
    [
      virtualFileIdImportUserCodeServer,
      virtualFileIdImportUserCodeClientCR,
      virtualFileIdImportUserCodeClientSR
    ].includes(id)
  )
  const isForClientSide = id !== virtualFileIdImportUserCodeServer
  const isClientRouting = id === virtualFileIdImportUserCodeClientCR
  return { isForClientSide, isClientRouting }
}
