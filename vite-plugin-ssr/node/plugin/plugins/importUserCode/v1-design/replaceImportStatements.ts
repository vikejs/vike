export { replaceImportStatements }
export { parseImportMacro }
export { isImportMacro }

// Playground: https://github.com/brillout/acorn-playground

import { parse } from 'acorn'
import type { Program, Identifier } from 'estree'
import { assert } from '../../../utils'

function replaceImportStatements(code: string): string {
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
  return codeMod
}

function getImportMacro({ importPath, importName }: { importPath: string; importName: string }): string {
  return `__import|${importPath}|${importName}`
}
function isImportMacro(str: string): boolean {
  return str.startsWith('__import|')
}
function parseImportMacro(importMacro: string): { importPath: string; importName: string } {
  const parts = importMacro.split('|')
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
