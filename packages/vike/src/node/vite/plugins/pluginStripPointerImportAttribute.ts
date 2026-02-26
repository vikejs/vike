export { pluginStripPointerImportAttribute }

// Strip `with { type: 'vike-pointer' }` import attributes from files transpiled for the
// client/server runtime. These attributes are only meaningful at config-time (they tell
// Vike to treat the import as a pointer import); leaving them in runtime bundles would
// break bundlers/runtimes that don't support unknown import attributes.

import type { Plugin } from 'vite'
import { getMagicString } from '../shared/getMagicString.js'
import '../assertEnvVite.js'

// Match `with { type: 'vike-pointer' }` (with optional whitespace variations)
const runtimeAttrRE = /\bwith\s*\{\s*type\s*:\s*['"]vike-pointer['"]\s*\}/g

function pluginStripPointerImportAttribute(): Plugin[] {
  return [
    {
      name: 'vike:pluginStripPointerImportAttribute',
      transform: {
        filter: {
          code: {
            include: 'vike-pointer',
          },
        },
        handler(code, id) {
          runtimeAttrRE.lastIndex = 0
          if (!runtimeAttrRE.test(code)) return
          const { magicString, getMagicStringResult } = getMagicString(code, id)
          runtimeAttrRE.lastIndex = 0
          let match: RegExpExecArray | null
          while ((match = runtimeAttrRE.exec(code)) !== null) {
            magicString.remove(match.index, match.index + match[0].length)
          }
          return getMagicStringResult()
        },
      },
    },
  ]
}
