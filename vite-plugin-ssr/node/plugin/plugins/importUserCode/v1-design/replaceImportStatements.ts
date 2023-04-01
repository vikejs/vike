export { replaceImportStatements }
export { parseImportData }
export { isImportData }
export type { FileImport }

// Playground: https://github.com/brillout/acorn-playground

import { parse } from 'acorn'
import type { Program, Identifier } from 'estree'
import { assert } from '../../../utils'

type FileImport = {
  code: string
  data: string
  importVarName: string
}
function replaceImportStatements(code: string): { code: string; fileImports: FileImport[] } {
  const { body } = parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module'
    // https://github.com/acornjs/acorn/issues/1136
  }) as any as Program

  const spliceOperations: SpliceOperation[] = []
  const fileImports: FileImport[] = []

  body.forEach((node) => {
    if (node.type !== 'ImportDeclaration') return

    const importPath = node.source.value
    assert(typeof importPath === 'string')

    const { start, end } = node

    const importCode = code.slice(start, end)

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
      const importData = serializeImportData({ importPath, importName })
      replacement += `const ${importVarName} = '${importData}';`
      fileImports.push({
        code: importCode,
        data: importData,
        importVarName
      })
    })
    assert(replacement.length > 0)

    spliceOperations.push({
      start,
      end,
      replacement
    })
  })

  const codeMod = spliceMany(code, spliceOperations)
  return { code: codeMod, fileImports }
}

type ImportData = { importPath: string; importName: string }
function serializeImportData({ importPath, importName }: ImportData): string {
  return `__import|${importPath}|${importName}`
}
function isImportData(str: string): boolean {
  return str.startsWith('__import|')
}
function parseImportData(str: string): null | ImportData {
  if (!isImportData(str)) {
    return null
  }
  const parts = str.split('|')
  assert(parts[0] === '__import')
  assert(parts.length >= 3)
  const importName = parts[parts.length - 1]!
  const importPath = parts.slice(1, -1).join('|')
  return { importPath, importName }
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
