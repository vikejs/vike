export { replaceImportStatements }
export { parseImportData }
export { isImportData }
export type { FileImport }
export type { ImportData }

// Playground: https://github.com/brillout/acorn-playground

import { parse } from 'acorn'
import type { Program, Identifier, ImportDeclaration } from 'estree'
import { assert, assertUsage, assertWarning, styleFileRE } from '../../../utils'
import pc from '@brillout/picocolors'

type FileImport = {
  importCode: string
  importData: string
  importVarName: string
}
function replaceImportStatements(
  code: string,
  filePathToShowToUser: string
): { noImportStatement: true } | { noImportStatement: false; code: string; fileImports: FileImport[] } {
  const spliceOperations: SpliceOperation[] = []
  const fileImports: FileImport[] = []

  const imports = getImports(code)
  if (imports.length === 0) return { noImportStatement: true }

  imports.forEach((node) => {
    if (node.type !== 'ImportDeclaration') return

    const importPath = node.source.value
    assert(typeof importPath === 'string')

    const { start, end } = node

    const importCode = code.slice(start, end)

    // No variable imported
    if (node.specifiers.length === 0) {
      const isWarning = !styleFileRE.test(importPath)
      let quote = indent(importCode)
      if (isWarning) {
        quote = pc.cyan(quote)
      } else {
        quote = pc.bold(pc.red(quote))
      }
      const errMsg = [
        `As explained in https://vite-plugin-ssr.com/header-file the following import in ${filePathToShowToUser} has no effect:`,
        quote
      ].join('\n')
      if (!isWarning) {
        assertUsage(false, errMsg)
      }
      assertWarning(false, errMsg, { onlyOnce: true, showStackTrace: false })
    }

    let replacement = ''
    node.specifiers.forEach((specifier) => {
      assert(specifier.type === 'ImportSpecifier' || specifier.type === 'ImportDefaultSpecifier')
      const importVarName = specifier.local.name
      const importName = (() => {
        if (specifier.type === 'ImportDefaultSpecifier') return 'default'
        {
          const imported = (specifier as any).imported as Identifier | undefined
          if (imported) return imported.name
        }
        return importVarName
      })()
      const importData = serializeImportData({ importPath, importName, importWasGenerated: true })
      replacement += `const ${importVarName} = '${importData}';`
      fileImports.push({
        importCode,
        importData,
        importVarName
      })
    })

    spliceOperations.push({
      start,
      end,
      replacement
    })
  })

  const codeMod = spliceMany(code, spliceOperations)
  return { code: codeMod, fileImports, noImportStatement: false }
}
function getImports(code: string): ImportDeclaration[] {
  const { body } = parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module'
    // https://github.com/acornjs/acorn/issues/1136
  }) as any as Program
  const imports: ImportDeclaration[] = []
  body.forEach((node) => {
    if (node.type === 'ImportDeclaration') imports.push(node)
  })
  return imports
}

const import_ = 'import'
const SEP = ':'
const zeroWidthSpace = '\u200b'
type ImportData = {
  importPath: string
  importName: string
  importWasGenerated: boolean
}
function serializeImportData({ importPath, importName, importWasGenerated }: ImportData): string {
  const tag = importWasGenerated ? zeroWidthSpace : ''
  // `import:${importPath}:${importPath}`
  return `${tag}${import_}${SEP}${importPath}${SEP}${importName}`
}
function isImportData(str: string): boolean {
  return str.startsWith(import_ + SEP) || str.startsWith(zeroWidthSpace + import_ + SEP)
}
function parseImportData(str: string): null | ImportData {
  if (!isImportData(str)) {
    return null
  }

  let importWasGenerated = false
  if (str.startsWith(zeroWidthSpace)) {
    importWasGenerated = true
    assert(zeroWidthSpace.length === 1)
    str = str.slice(1)
  }

  const parts = str.split(SEP).slice(1)
  if (!importWasGenerated && parts.length === 1) {
    const importName = 'default'
    const importPath = parts[0]!
    return { importPath, importName, importWasGenerated }
  }
  assert(parts.length >= 2)
  const importName = parts[parts.length - 1]!
  const importPath = parts.slice(0, -1).join(SEP)
  return { importPath, importName, importWasGenerated }
}

// https://github.com/acornjs/acorn/issues/1136#issuecomment-1203671368
declare module 'estree' {
  interface BaseNodeWithoutComments {
    start: number
    end: number
  }
}

type SpliceOperation = {
  start: number
  end: number
  replacement: string
}
function spliceMany(str: string, operations: SpliceOperation[]): string {
  let strMod = ''
  let endPrev: number | undefined
  operations.forEach(({ start, end, replacement }) => {
    if (endPrev !== undefined) {
      assert(endPrev < start)
    } else {
      endPrev = 0
    }
    strMod += str.slice(endPrev, start) + replacement
    endPrev = end
  })
  strMod += str.slice(endPrev, str.length - 1)
  return strMod
}

function indent(str: string) {
  return str
    .split('\n')
    .map((s) => `  ${s}`)
    .join('\n')
}
