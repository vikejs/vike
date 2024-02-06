export { transformFileImports }
export { parseImportData }
export { isImportData }
export type { FileImport }
export type { ImportData }

// Playground: https://github.com/brillout/acorn-playground
// Import attributes support: https://github.com/acornjs/acorn/issues/983
//  - Isn't stage 4 yet: https://github.com/tc39/proposal-import-attributes

import { parse } from 'acorn'
import type { Program, Identifier, ImportDeclaration } from 'estree'
import { assert, assertUsage, assertWarning, styleFileRE } from '../../../../utils.js'
import pc from '@brillout/picocolors'

type FileImport = {
  importStatementCode: string
  importString: string
  importLocalName: string
}
function transformFileImports(
  code: string,
  filePathToShowToUser2: string,
  // For ./transformFileImports.spec.ts
  skipWarnings?: true
): { noTransformation: true } | { noTransformation: false; code: string; fileImportsTransformed: FileImport[] } {
  const spliceOperations: SpliceOperation[] = []
  const fileImportsTransformed: FileImport[] = []

  // Performance trick
  if (!code.includes('import')) return { noTransformation: true }

  const imports = getImports(code)
  if (imports.length === 0) return { noTransformation: true }

  imports.forEach((node) => {
    if (node.type !== 'ImportDeclaration') return

    const importPath = node.source.value
    assert(typeof importPath === 'string')

    // - This doesn't work. To make it work we would need to run esbuild twice: esbuild for TypeScript to JavaScript => transformFileImports() => esbuild for bundling.
    //   - Or we use an esbuild plugin to apply transformFileImports(). Maybe we can completely skip the need for acorn?
    // - ?real breaks TypeScript, and TypeScript isn't working on supporting query params: https://github.com/microsoft/TypeScript/issues/10988#issuecomment-867135453
    // - Import attributes would be the best.
    //   - But it only works with Node.js >=21: https://nodejs.org/api/esm.html#import-attributes
    //     - But it's probably ok to tell users "to use real imports you need Node.js 21 or above".
    //   - It works well with TypeScript: it doesn't complain upon `with { type: 'unknown-to-typescript' }` and go-to-definition & types are preserved: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-3.html#import-attributes
    //   - Esbuid seems to support it: https://esbuild.github.io/plugins/#on-load-arguments:~:text=This%20contains%20a%20map%20of%20the%20import%20attributes%20that
    //   - acorn supports it over an acorn plugin: https://github.com/acornjs/acorn/issues/983
    //     - Maybe we can use an esbuild plugin instead of acorn to apply transformFileImports()?
    // - Using a magic comment `// @vike-real-import` is tricky:
    //   - Esbuild removes comments: https://github.com/evanw/esbuild/issues/1439#issuecomment-877656182
    //   - Using source maps to track these magic comments is brittle (source maps can easily break)
    if (importPath.endsWith('?real')) {
      const { start, end } = node.source
      spliceOperations.push({
        start,
        end,
        replacement: importPath.slice(0, -1 * '?real'.length)
      })
      return
    }

    const { start, end } = node

    const importStatementCode = code.slice(start, end)

    // No variable imported
    if (node.specifiers.length === 0) {
      const isWarning = !styleFileRE.test(importPath)
      let quote = indent(importStatementCode)
      if (isWarning) {
        quote = pc.cyan(quote)
      } else {
        quote = pc.bold(pc.red(quote))
      }
      const errMsg = [
        `As explained in https://vike.dev/header-file the following import in ${filePathToShowToUser2} has no effect:`,
        quote
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
      const importString = serializeImportData({ importPath, exportName, importStringWasGenerated: true })
      replacement += `const ${importLocalName} = '${importString}';`
      fileImportsTransformed.push({
        importStatementCode,
        importString,
        importLocalName
      })
    })

    spliceOperations.push({
      start,
      end,
      replacement
    })
  })

  const codeMod = spliceMany(code, spliceOperations)
  return { code: codeMod, fileImportsTransformed, noTransformation: false }
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
 * Data Structure holding info about import statement:
 *   `import { someExport as someImport } from './some-file'`
 * <=>
 *   `importData === {`
 *      `importPath: './some-file',`
 *      `exportName: 'someExport',`
 *      `importString: 'import:./some-file:someExport',`
 *      `importStringWasGenerated: true,`
 *    `}`
 * We discard the import name `someImport` because we don't need it.
 */
type ImportData = {
  importPath: string
  exportName: string
  importString: string
  importStringWasGenerated: boolean
}
function serializeImportData({
  importPath,
  exportName,
  importStringWasGenerated
}: Omit<ImportData, 'importString'>): string {
  const tag = importStringWasGenerated ? zeroWidthSpace : ''
  // `import:${importPath}:${importPath}`
  return `${tag}${import_}${SEP}${importPath}${SEP}${exportName}`
}
function isImportData(str: string): boolean {
  return str.startsWith(import_ + SEP) || str.startsWith(zeroWidthSpace + import_ + SEP)
}
function parseImportData(importString: string): null | ImportData {
  if (!isImportData(importString)) {
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
