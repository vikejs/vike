export { replaceImportStatements }
export { parseImportMacro }

// Playground: https://github.com/brillout/acorn-playground

import { parse } from 'acorn'
import type { Program, Identifier } from 'estree'
import { assert } from '../../../utils'

function replaceImportStatements(code: string): { code: string; importStaments: string[] } {
  const { body } = parse(code, {
    ecmaVersion: 'latest',
    sourceType: 'module'
    // https://github.com/acornjs/acorn/issues/1136
  }) as any as Program

  const spliceOperations: SpliceOperation[] = []

  body.forEach((node) => {
    if (node.type !== 'ImportDeclaration') return

    const importPath = node.source.value
    assert(typeof importPath === 'string')

    let replacement = ''
    node.specifiers.forEach((specifier) => {
      assert(specifier.type === 'ImportSpecifier' || specifier.type === 'ImportDefaultSpecifier')
      const importVar = specifier.local.name
      const importName = (() => {
        if (specifier.type === 'ImportDefaultSpecifier') return 'default'
        {
          const imported = (specifier as any).imported as Identifier | undefined
          if (imported) return imported.name
        }
        return importVar
      })()
      const importMacro = getImportMacro({ importPath, importName })
      replacement += `const ${importVar} = '${importMacro}';`
    })
    assert(replacement.length > 0)

    const { start, end } = node
    spliceOperations.push({
      start,
      end,
      replacement
    })
  })

  const codeMod = spliceMany(code, spliceOperations)
  return { code: codeMod, importStaments: [] }
}

type ImportMacro = { importPath: string; importName: string }
function getImportMacro({ importPath, importName }: ImportMacro): string {
  return `__import|${importPath}|${importName}`
}
function parseImportMacro(str: string): null | ImportMacro {
  if (!str.startsWith('__import|')) {
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
