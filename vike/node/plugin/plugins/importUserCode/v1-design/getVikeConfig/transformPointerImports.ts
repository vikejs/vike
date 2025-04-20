export { transformPointerImports }
export { parsePointerImportData }
export { isPointerImportData }
export type { PointerImportData }

// Playground: https://github.com/brillout/acorn-playground

// Notes about `with { type: 'pointer' }`
// - It works well with TypeScript: it doesn't complain upon `with { type: 'unknown-to-typescript' }` and go-to-definition & types are preserved: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-3.html#import-attributes
// - Acorn support for import attributes: https://github.com/acornjs/acorn/issues/983
//   - Acorn plugin: https://github.com/acornjs/acorn/issues/983
//   - Isn't stage 4 yet: https://github.com/tc39/proposal-import-attributes
// - Using a import path suffix such as `import { Layout } from './Layout?real` breaks TypeScript, and TypeScript isn't working on supporting query params: https://github.com/microsoft/TypeScript/issues/10988#issuecomment-867135453
// - Node.js >=21 supports import attribtues: https://nodejs.org/api/esm.html#import-attributes
// - Esbuid supports
//   - Blocker: https://github.com/evanw/esbuild/issues/3646
//     - Ugly hack to make it work: https://github.com/brillout/esbuild-playground/tree/experiment/import-attribute
//   - Discussion with esbuild maintainer: https://github.com/evanw/esbuild/issues/3384
// - Using a magic comment `// @vike-real-import` is probably a bad idea:
//   - Esbuild removes comments: https://github.com/evanw/esbuild/issues/1439#issuecomment-877656182
//   - Using source maps to track these magic comments is brittle (source maps can easily break)

import { parse } from 'acorn'
import type { Program, Identifier, ImportDeclaration } from 'estree'
import { assert, assertUsage, assertWarning, styleFileRE } from '../../../../utils.js'
import pc from '@brillout/picocolors'

function transformPointerImports(
  code: string,
  filePathToShowToUser2: string,
  pointerImports:
    | Record<string, boolean>
    // Used by ./transformPointerImports.spec.ts
    | 'all',
  // For ./transformPointerImports.spec.ts
  skipWarnings?: true
): string | null {
  const spliceOperations: SpliceOperation[] = []

  // Performance trick
  if (!code.includes('import')) return null

  const imports = getImports(code)
  if (imports.length === 0) return null

  imports.forEach((node) => {
    if (node.type !== 'ImportDeclaration') return

    const importPath = node.source.value
    assert(typeof importPath === 'string')

    if (pointerImports !== 'all') {
      assert(importPath in pointerImports)
      const isPointerImport = pointerImports[importPath]
      assert(isPointerImport === true || isPointerImport === false)
      if (!isPointerImport) return
    }

    const { start, end } = node
    const importStatementCode = code.slice(start, end)

    /* Pointer import without importing any value => doesn't make sense and doesn't have any effect.
    ```js
    // Useless
    import './some.css'
    // Useless
    import './Layout.jsx'
    ``` */
    if (node.specifiers.length === 0) {
      const isWarning = !styleFileRE.test(importPath)
      let quote = indent(importStatementCode)
      if (isWarning) {
        quote = pc.cyan(quote)
      } else {
        quote = pc.bold(pc.red(quote))
      }
      const errMsg = [
        `The following import in ${filePathToShowToUser2} has no effect:`,
        quote,
        'See https://vike.dev/config#pointer-imports'
      ].join('\n')
      if (!skipWarnings) {
        if (!isWarning) {
          assertUsage(false, errMsg)
        }
        assertWarning(false, errMsg, { onlyOnce: true })
      }
    }

    let replacement = ''
    node.specifiers.forEach((specifier) => {
      assert(
        specifier.type === 'ImportSpecifier' ||
          specifier.type === 'ImportDefaultSpecifier' ||
          specifier.type === 'ImportNamespaceSpecifier'
      )
      const importLocalName = specifier.local.name
      const exportName = (() => {
        if (specifier.type === 'ImportDefaultSpecifier') return 'default'
        if (specifier.type === 'ImportNamespaceSpecifier') return '*'
        {
          const imported = (specifier as any).imported as Identifier | undefined
          if (imported) return imported.name
        }
        return importLocalName
      })()
      const importString = serializePointerImportData({ importPath, exportName, importStringWasGenerated: true })
      replacement += `const ${importLocalName} = '${importString}';`
    })

    spliceOperations.push({
      start,
      end,
      replacement
    })
  })

  const codeMod = spliceMany(code, spliceOperations)
  return codeMod
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
/**
 * Data Structure for [pointer imports](https://vike.dev/config#pointer-imports):
 *   `import { someExport as someImport } from './some-file'`
 * <=>
 *   `pointerImportData === {`
 *      `importPath: './some-file',`
 *      `exportName: 'someExport',`
 *      `importString: 'import:./some-file:someExport',`
 *      `importStringWasGenerated: true,`
 *    `}`
 * We discard the import name `someImport` because we don't need it.
 */
type PointerImportData = {
  importPath: string
  exportName: string
  importString: string
  importStringWasGenerated: boolean
}
function serializePointerImportData({
  importPath,
  exportName,
  importStringWasGenerated
}: Omit<PointerImportData, 'importString'>): string {
  const tag = importStringWasGenerated ? zeroWidthSpace : ''
  // `import:${importPath}:${importPath}`
  return `${tag}${import_}${SEP}${importPath}${SEP}${exportName}`
}
function isPointerImportData(str: string): boolean {
  return str.startsWith(import_ + SEP) || str.startsWith(zeroWidthSpace + import_ + SEP)
}
function parsePointerImportData(importString: string): null | PointerImportData {
  if (!isPointerImportData(importString)) {
    return null
  }

  let importStringWasGenerated = false
  if (importString.startsWith(zeroWidthSpace)) {
    importStringWasGenerated = true
    assert(zeroWidthSpace.length === 1)
    importString = importString.slice(1)
  }

  const parts = importString.split(SEP).slice(1)
  if (!importStringWasGenerated && parts.length === 1) {
    const exportName = 'default'
    const importPath = parts[0]!
    return { importPath, exportName, importStringWasGenerated, importString }
  }
  assert(parts.length >= 2)
  const exportName = parts[parts.length - 1]!
  const importPath = parts.slice(0, -1).join(SEP)

  if (importPath.startsWith('.')) {
    assertUsage(
      importPath.startsWith('./') || importPath.startsWith('../'),
      `Invalid relative import path ${pc.code(importPath)} defined by ${pc.code(JSON.stringify(importString))} because it should start with ${pc.code('./')} or ${pc.code('../')}, or use an npm package import instead.`
    )
  }

  return { importPath, exportName, importStringWasGenerated, importString }
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
    const replaced = str.slice(start, end)
    strMod +=
      str.slice(endPrev, start) +
      replacement +
      // Preserve number of lines for source map
      Array(replaced.split('\n').length - replacement.split('\n').length)
        .fill('\n')
        .join('')
    endPrev = end
  })
  strMod += str.slice(endPrev, str.length)
  return strMod
}

function indent(str: string) {
  return str
    .split('\n')
    .map((s) => `  ${s}`)
    .join('\n')
}
