export { isVirutalModulePageCodeFilesImporter }
export { getVirutalModuleIdPageCodeFilesImporter }

import { extractAssetsRemoveQuery } from '../plugin/plugins/extractAssetsPlugin/extractAssetsAddQuery'
import { assert } from '../utils'

const idBase = 'virtual:vite-plugin-ssr:pageCodeFilesImporter:'
const idBaseClient = `${idBase}client:` as const
const idBaseServer = `${idBase}server:` as const

function getVirutalModuleIdPageCodeFilesImporter(pageId: string, isForClientSide: boolean): string {
  return (isForClientSide ? idBaseClient : idBaseServer) + pageId
}
function isVirutalModulePageCodeFilesImporter(
  id: string
): null | { isForClientSide: boolean; pageId: string; isExtractAssets: boolean } {
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
