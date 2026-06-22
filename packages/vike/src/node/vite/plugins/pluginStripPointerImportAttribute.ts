export { pluginStripPointerImportAttribute }

// Pointer import attributes (`with { type: 'vike:pointer' }`) are only meaningful at
// config-time. Leaving them in the client/server runtime bundles would break
// bundlers/runtimes that don't support unknown import attributes, so we strip them out.

import type { Plugin } from 'vite'
import type MagicString from 'magic-string'
import { getImportStatements } from '../shared/parseEsModule.js'
import { getMagicString } from '../shared/getMagicString.js'
import '../assertEnvVite.js'

// e.g. `with { type: 'vike:pointer' }`
const runtimeAttrRE = /\bwith\s*\{\s*type\s*:\s*['"]vike:pointer['"]\s*\}/g

function pluginStripPointerImportAttribute(): Plugin[] {
  return [
    {
      name: 'vike:pluginStripPointerImportAttribute',
      transform: {
        filter: {
          code: {
            include: 'vike:pointer',
          },
        },
        handler(code, id) {
          return stripPointerImportAttributes(code, id)
        },
      },
    },
  ]
}

async function stripPointerImportAttributes(code: string, id: string) {
  // Fast path: skip parsing when there is nothing to strip
  runtimeAttrRE.lastIndex = 0
  if (!runtimeAttrRE.test(code)) return

  // Restrict stripping to genuine `import` statements, so that we don't touch occurrences
  // inside string literals/comments (e.g. documentation code examples).
  // https://github.com/brillout/docpress/issues/167
  let importStatements: Awaited<ReturnType<typeof getImportStatements>>
  try {
    importStatements = await getImportStatements(code)
  } catch {
    // Not parsable as an ES module (e.g. a raw Markdown file): leave it untouched.
    // Falling back to a global strip here would re-introduce the bug above.
    return
  }

  const { magicString, getMagicStringResult } = getMagicString(code, id)
  for (const { ss, se } of importStatements) stripAttribute(magicString, code, ss, se)
  return getMagicStringResult()
}

function stripAttribute(magicString: MagicString, code: string, start: number, end: number) {
  const region = code.slice(start, end)
  runtimeAttrRE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = runtimeAttrRE.exec(region)) !== null) {
    magicString.remove(start + match.index, start + match.index + match[0].length)
  }
}
