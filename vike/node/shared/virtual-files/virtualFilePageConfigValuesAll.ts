export { isVirtualFileIdPageConfigValuesAll }
export { getVirtualFileIdPageConfigValuesAll }

import { assert, getVirtualFileId } from '../utils.js'

const idBase = 'virtual:vike:pageConfigValuesAll:'
const idBaseClient = `${idBase}client:` as const
const idBaseServer = `${idBase}server:` as const

function getVirtualFileIdPageConfigValuesAll(pageId: string, isForClientSide: boolean): `${typeof idBase}${string}` {
  const id = `${isForClientSide ? idBaseClient : idBaseServer}${pageId}` as const
  return id
}

// TODO: remove ?extractAssets code
function isVirtualFileIdPageConfigValuesAll(id: string): false | { isForClientSide: boolean; pageId: string } {
  id = getVirtualFileId(id)
  if (!id.includes(idBase)) return false
  assert(id.startsWith(idBase))
  if (id.startsWith(idBaseClient)) {
    return {
      pageId: id.slice(idBaseClient.length),
      isForClientSide: true
    }
  }
  if (id.startsWith(idBaseServer)) {
    return {
      pageId: id.slice(idBaseServer.length),
      isForClientSide: false
    }
  }
  assert(false)
}
