export { replaceImportStatements }

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

  body
    .filter((node) => node.type === 'ImportDeclaration')
    .forEach((node) => {
      assert(node.type === 'ImportDeclaration')
      const file = node.source.value
      assert(file)

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
        replacement += `const ${importVar} = '__import|${file}|${importName}';`
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
