export { getVirtualFileId }
export { resolveVirtualFileId }
export { isVirtualFileId }
export { isVirtualFileIdUresolved }

import { assert } from './assert'

const idBase = 'virtual:vite-plugin-ssr:'
// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
const tag = '\0'

function getVirtualFileId(id: string): string {
  assert(isVirtualFileId(id))
  assert(id.startsWith(tag))
  id = id.slice(tag.length)
  return id
}
function isVirtualFileId(id: string): boolean {
  if (id.startsWith(tag + idBase)) {
    return true
  }
  assert(!id.includes(idBase))
  return false
}
function isVirtualFileIdUresolved(id: string): boolean {
  assert(!id.includes(tag + idBase))
  return id.startsWith(idBase)
}
function resolveVirtualFileId(id: string): string {
  return tag + id
}
