export { isVirtualFileIdPageConfigValuesAll }
export { getVirtualFileIdPageConfigValuesAll }

import { extractAssetsRemoveQuery } from '../extractAssetsQuery.js'
import { assert, getVirtualFileId } from '../utils.js'

const idBase = 'virtual:vite-plugin-ssr:pageConfigValuesAll:'
const idBaseClient = `${idBase}client:` as const
const idBaseServer = `${idBase}server:` as const

function getVirtualFileIdPageConfigValuesAll(pageId: string, isForClientSide: boolean): string {
  const id = (isForClientSide ? idBaseClient : idBaseServer) + pageId
  return id
}
function isVirtualFileIdPageConfigValuesAll(
  id: string
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
      isExtractAssets
    }
  }
  if (id.startsWith(idBaseServer)) {
    return {
      pageId: id.slice(idBaseServer.length),
      isForClientSide: false,
      isExtractAssets
    }
  }
  assert(false)
}
