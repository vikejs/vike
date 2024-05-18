export { addImportStatement }

/**
 * Naming:
 *   `import { someExport as someImport } from './some-file'`
 * <=>
 *   `{`
 *      `importPath: './some-file',`
 *      `exportName: 'someExport',`
 *      `importName: 'someImport',`
 *    `}`
 */
function addImportStatement(
  importStatements: string[],
  importPath: string,
  exportName: string
): { importName: string } {
  const importCounter = importStatements.length + 1
  const importName = `import${importCounter}` as const
  const importLiteral = (() => {
    if (exportName === '*') {
      return `* as ${importName}` as const
    }
    if (exportName === 'default') {
      return importName
    }
    return `{ ${exportName} as ${importName} }` as const
  })()
  const importStatement = `import ${importLiteral} from '${importPath}';`
  importStatements.push(importStatement)
  return { importName }
}
