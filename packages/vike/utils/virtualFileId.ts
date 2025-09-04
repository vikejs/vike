export { isVirtualFileId }
export { addVirtualFileIdPrefix }
export { removeVirtualFileIdPrefix }
export { virtualFileIdPrefix1 }
export { virtualFileIdPrefix2 }

import pc from '@brillout/picocolors'
import { assert, assertUsage } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

const virtualFileIdPrefix1 = 'virtual:vike:'
// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
const convention = '\0'
const virtualFileIdPrefix2 = `${convention}${virtualFileIdPrefix1}` as const

function isVirtualFileId(id: string): boolean {
  if (id.startsWith(virtualFileIdPrefix1)) return true
  if (id.startsWith(virtualFileIdPrefix2)) return true
  // https://github.com/vikejs/vike/issues/1985
  assertUsage(
    !id.includes(virtualFileIdPrefix1),
    `Encountered a module ID ${pc.cyan(
      id,
    )} that is unexpected. Are you using a tool that modifies the ID of modules? For example, the baseUrl setting in tsconfig.json cannot be used.`,
  )
  return false
}
function addVirtualFileIdPrefix(id: string): string {
  assert(isVirtualFileId(id))
  if (!id.startsWith(convention)) {
    id = convention + id
  }
  assert(id.startsWith(convention))
  return id
}

function removeVirtualFileIdPrefix(id: string): string {
  if (id.startsWith(convention)) {
    id = id.slice(convention.length)
  }
  assert(!id.startsWith(convention))
  return id
}
