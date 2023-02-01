export { isVirutalModulePageCodeFilesImporter }
export { getVirutalModuleIdPageCodeFilesImporter }

import { assert } from '../../../utils'

const idBase = 'virtual:vite-plugin-ssr:pageCodeFilesImporter:'
const idBaseClient = `${idBase}client:` as const
const idBaseServer = `${idBase}server:` as const

function getVirutalModuleIdPageCodeFilesImporter(pageId: string, isForClientSide: boolean): string {
  return (isForClientSide ? idBaseClient : idBaseServer) + pageId
}
function isVirutalModulePageCodeFilesImporter(id: string): null | { isForClientSide: boolean; pageId: string } {
  if (!id.startsWith(idBase)) return null
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
