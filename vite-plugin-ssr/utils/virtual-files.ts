export { isVirtualFileId }
export { getVirtualFileId }
export { resolveVirtualFileId }

import { assert } from './assert.js'

const idBase = 'virtual:vite-plugin-ssr:'
// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
const tag = '\0'

function isVirtualFileId(id: string): boolean {
  if (id.startsWith(idBase)) return true
  if (id.startsWith(tag + idBase)) return true
  assert(!id.includes(idBase))
  return false
}
function getVirtualFileId(id: string): string {
  if (id.startsWith(tag)) {
    id = id.slice(tag.length)
  }
  assert(!id.startsWith(tag))
  return id
}
function resolveVirtualFileId(id: string): string {
  assert(isVirtualFileId(id))
  if (!id.startsWith(tag)) {
    id = tag + id
  }
  assert(id.startsWith(tag))
  return id
}
