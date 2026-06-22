export { pluginStripPointerImportAttribute }
export { stripPointerImportAttributes }

// Strip `with { type: 'vike:pointer' }` import attributes from files transpiled for the
// client/server runtime. These attributes are only meaningful at config-time (they tell
// Vike to treat the import as a pointer import); leaving them in runtime bundles would
// break bundlers/runtimes that don't support unknown import attributes.

import type { Plugin } from 'vite'
import type MagicString from 'magic-string'
import { getImportStatements } from '../shared/parseEsModule.js'
import { getMagicString } from '../shared/getMagicString.js'
import '../assertEnvVite.js'

// Match `with { type: 'vike:pointer' }` (with optional whitespace variations)
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
  // Quick check: bail if the attribute isn't present at all.
  runtimeAttrRE.lastIndex = 0
  if (!runtimeAttrRE.test(code)) return

  // Only strip *real* import attributes — not occurrences inside string literals or
  // comments, such as documentation code examples that contain
  // `with { type: 'vike:pointer' }`. See: https://github.com/brillout/docpress/issues/167
  // We use es-module-lexer to locate genuine `import` statements and only strip the
  // attribute within their boundaries.
  let importStatements: Awaited<ReturnType<typeof getImportStatements>>
  try {
    importStatements = await getImportStatements(code)
  } catch {
    // The code isn't a parsable ES module (e.g. a raw Markdown/MDX file being processed
    // before compilation) => leave it untouched. (We deliberately don't fall back to
    // stripping globally: that would wrongly remove the attribute from code examples.)
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
