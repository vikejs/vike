export { isVirtualModuleIdImportPageCode }
export { getVirtualFileIdImportPageCode }

import { extractAssetsRemoveQuery } from '../../plugin/plugins/extractAssetsPlugin/extractAssetsAddQuery'
import { assert, getVirtualFileId } from '../../utils'

const idBase = 'virtual:vite-plugin-ssr:importPageCode:'
const idBaseClient = `${idBase}client:` as const
const idBaseServer = `${idBase}server:` as const

function getVirtualFileIdImportPageCode(pageId: string, isForClientSide: boolean): string {
  return (isForClientSide ? idBaseClient : idBaseServer) + pageId
}
function isVirtualModuleIdImportPageCode(
  id: string
): null | { isForClientSide: boolean; pageId: string; isExtractAssets: boolean } {
  id = getVirtualFileId(id)
  if (!id.startsWith(idBase)) return null
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
