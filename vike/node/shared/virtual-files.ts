export { isVirtualFileId }
export { getVirtualFileId }
export { resolveVirtualFileId }

import pc from '@brillout/picocolors'
import { assert, assertUsage } from './utils.js'

const idBase = 'virtual:vike:'
// https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention
const virtualIdTag = '\0'

function isVirtualFileId(id: string): boolean {
  if (id.startsWith(idBase)) return true
  if (id.startsWith(virtualIdTag + idBase)) return true
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
  return removeVirtualIdTag(id)
}
function resolveVirtualFileId(id: string): string {
  assert(isVirtualFileId(id))
  if (!id.startsWith(virtualIdTag)) {
    id = virtualIdTag + id
  }
  assert(id.startsWith(virtualIdTag))
  return id
}

function removeVirtualIdTag(id: string): string {
  if (id.startsWith(virtualIdTag)) {
    id = id.slice(virtualIdTag.length)
  }
  assert(!id.startsWith(virtualIdTag))
  return id
}
