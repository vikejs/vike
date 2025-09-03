export { isVirtualFileId }
export { addVirtualFileIdPrefix }
export { removeVirtualFileIdPrefix }

import pc from '@brillout/picocolors'
import { assert, assertUsage } from './assert.js'
import { assertIsNotBrowser } from './assertIsNotBrowser.js'
assertIsNotBrowser()

const virtualFileIdPrefix = 'virtual:vike:'
// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
const convention = '\0'

function isVirtualFileId(id: string): boolean {
  if (id.startsWith(virtualFileIdPrefix)) return true
  if (id.startsWith(convention + virtualFileIdPrefix)) return true
  // https://github.com/vikejs/vike/issues/1985
  assertUsage(
    !id.includes(virtualFileIdPrefix),
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
