// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention

export { getVirtualId }
export { getRealId }

import {
  virtualModuleIdPageFilesClientSR,
  virtualModuleIdPageFilesClientCR,
  virtualModuleIdPageFilesServer
} from './virtualModuleIdPageFiles'
const idsVirtual = [virtualModuleIdPageFilesServer, virtualModuleIdPageFilesClientSR, virtualModuleIdPageFilesClientCR]
const idsReal = idsVirtual.map((id) => '\0' + id)

function getVirtualId(idReal: string): undefined | string {
  const idx = idsVirtual.indexOf(idReal)
  if (idx === -1) return undefined
  const idVirtual = idsReal[idx]!
  return idVirtual
}
function getRealId(idVirtual: string): null | string {
  const idx = idsReal.indexOf(idVirtual)
  if (idx === -1) return null
  const idReal = idsVirtual[idx]!
  return idReal
}
