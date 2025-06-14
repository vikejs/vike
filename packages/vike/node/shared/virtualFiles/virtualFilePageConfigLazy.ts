export { isVirtualFileIdPageConfigLazy }
export { getVirtualFileIdPageConfigLazy }

import { extractAssetsRemoveQuery } from '../extractAssetsQuery.js'
import { assert } from '../utils.js'
import { getVirtualFileId } from '../virtualFiles.js'

const idBase = 'virtual:vike:pageConfigLazy:'
const idBaseClient = `${idBase}client:` as const
const idBaseServer = `${idBase}server:` as const

function getVirtualFileIdPageConfigLazy(pageId: string, isForClientSide: boolean): `${typeof idBase}${string}` {
  const id = `${isForClientSide ? idBaseClient : idBaseServer}${pageId}` as const
  return id
}
function isVirtualFileIdPageConfigLazy(
  id: string,
): false | { isForClientSide: boolean; pageId: string; isExtractAssets: boolean } {
  id = getVirtualFileId(id)
  if (!id.includes(idBase)) return false
  assert(id.startsWith(idBase))
  const idOriginal = id
  id = extractAssetsRemoveQuery(id)
  const isExtractAssets = idOriginal !== id
  if (id.startsWith(idBaseClient)) {
    assert(isExtractAssets === false)
    return {
      pageId: id.slice(idBaseClient.length),
      isForClientSide: true,
      isExtractAssets,
    }
  }
  if (id.startsWith(idBaseServer)) {
    return {
      pageId: id.slice(idBaseServer.length),
      isForClientSide: false,
      isExtractAssets,
    }
  }
  assert(false)
}
