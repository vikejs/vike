export { isVirtualFileId }
export { getVirtualFileId }
export { resolveVirtualFileId }

import pc from '@brillout/picocolors'
import { assert, assertUsage } from './assert.js'

const idBase = 'virtual:vike:'
// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
const tag = '\0'

function isVirtualFileId(id: string): boolean {
  if (id.startsWith(idBase)) return true
  if (id.startsWith(tag + idBase)) return true
  // https://github.com/vikejs/vike/issues/1985
  assertUsage(
    !id.includes(idBase),
    `Encountered a module ID ${pc.cyan(
      id
    )} that is unexpected. Are you using a tool that modifies the ID of modules? For example, the baseUrl setting in tsconfig.json cannot be used.`
  )
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
