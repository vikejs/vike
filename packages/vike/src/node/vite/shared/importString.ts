export { parseImportString }
export { isImportString }
export { serializeImportString }
export type { ImportString }
export type { ImportStringList }
export type { ImportStringParsed }

import { assert } from '../utils.js'

const IMPORT = 'import'
const SEP = ':'

/** `import:${importPath}:${exportName}`
 * @example import:./Layout:default
 */
type ImportString = `import:${string}:${string}` | `import:${string}`
type ImportStringList = ImportString | ImportString[]
type ImportStringParsed = {
  importPath: string
  exportName: string
}

/**
 * Parse import string in format: import:importPath:exportName
 *
 * @example parseImportString('import:react/jsx-runtime:jsx')
 * // => { importPath: 'react/jsx-runtime', exportName: 'jsx' }
 *
 * @example parseImportString('import:./Layout:default')
 * // => { importPath: './Layout', exportName: 'default' }
 *
 * @example parseImportString('import:./Layout', { legacy: true })
 * // => { importPath: './Layout', exportName: 'default' }
 */
function parseImportString(
  importString: string,
  { legacy = false }: { legacy?: boolean } = {},
): null | ImportStringParsed {
  if (!isImportString(importString)) return null
  const parts = importString.split(SEP)
  assert(parts[0] === IMPORT)

  if (legacy && parts.length === 2) {
    const exportName = 'default'
    const importPath = parts[1]
    assert(importPath)
    return { importPath, exportName }
  }

  assert(parts.length >= 3)
  const exportName = parts[parts.length - 1]!
  const importPath = parts.slice(1, -1).join(SEP)
  assert(exportName)
  assert(importPath)
  return { importPath, exportName }
}

/**
 * Check if a string is an import string (starts with 'import:').
 *
 * @example isImportString('import:react:jsx')
 * // => true
 *
 * @example isImportString('some-other-string')
 * // => false
 */
function isImportString(str: string): str is ImportString {
  return str.startsWith(`${IMPORT}${SEP}`)
}

/**
 * Serialize import string from importPath and export name.
 *
 * @example serializeImportString({ importPath: 'react/jsx-runtime', exportName: 'jsx' })
 * // => 'import:react/jsx-runtime:jsx'
 *
 * @example serializeImportString({ importPath: './Layout', exportName: 'default' })
 * // => 'import:./Layout:default'
 */
function serializeImportString({ importPath, exportName }: ImportStringParsed) {
  const importString = `${IMPORT}${SEP}${importPath}${SEP}${exportName}` as const
  return importString
}
