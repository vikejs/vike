export { isVirtualFileId }
export { getVirtualFileId }
export { addVirtualFileIdPrefix }
export { removeVirtualFileIdPrefix }

import pc from '@brillout/picocolors'
import { assert, assertUsage } from './utils.js'

const idBase = 'virtual:vike:'
// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
const prefix = '\0'

function isVirtualFileId(id: string): boolean {
  if (id.startsWith(idBase)) return true
  if (id.startsWith(prefix + idBase)) return true
  // https://github.com/vikejs/vike/issues/1985
  assertUsage(
    !id.includes(idBase),
    `Encountered a module ID ${pc.cyan(
      id,
    )} that is unexpected. Are you using a tool that modifies the ID of modules? For example, the baseUrl setting in tsconfig.json cannot be used.`,
  )
  return false
}
function getVirtualFileId(id: string): string {
  return removeVirtualFileIdPrefix(id)
}
function addVirtualFileIdPrefix(id: string): string {
  assert(isVirtualFileId(id))
  if (!id.startsWith(prefix)) {
    id = prefix + id
  }
  assert(id.startsWith(prefix))
  return id
}

function removeVirtualFileIdPrefix(id: string): string {
  if (id.startsWith(prefix)) {
    id = id.slice(prefix.length)
  }
  assert(!id.startsWith(prefix))
  return id
}
