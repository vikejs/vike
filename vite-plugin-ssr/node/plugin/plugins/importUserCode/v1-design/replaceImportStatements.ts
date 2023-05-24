export { replaceImportStatements }
export { parseImportData }
export { configValueToImportData }
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
        `As explained in https://vite-plugin-ssr.com/config-code-splitting the following import in ${filePathToShowToUser} has no effect:`,
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
      const importData = serializeImportData({ importPath, importName })
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

const _path = '_path'
const SEP = ':'
type ImportData = { importPath: string; importName: string }
function serializeImportData({ importPath, importName }: ImportData): string {
  // `_path:${importPath}:${importPath}`
  return `${_path}${SEP}${importPath}${SEP}${importName}`
}
function isImportData(str: string): boolean {
  return str.startsWith(_path + SEP)
}
function parseImportData(str: string): null | ImportData {
  if (!isImportData(str)) {
    return null
  }
  const parts = str.split(SEP)
  assert(parts[0] === _path)
  assert(parts.length >= 3)
  const importName = parts[parts.length - 1]!
  const importPath = parts.slice(1, -1).join(SEP)
  return { importPath, importName }
}
function configValueToImportData(
  configValue: unknown,
  configNameOriginal: string,
  interfaceFilePathToShowToUser: string
): string {
  assert(configNameOriginal.endsWith('Path'))
  assertUsage(
    typeof configValue === 'string',
    `${interfaceFilePathToShowToUser} sets '${configNameOriginal}' to a value with an invalid type \`${typeof configValue}\`, it should be a string instead`
  )
  const importDataStr = serializeImportData({ importPath: configValue, importName: 'default' })
  return importDataStr
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
