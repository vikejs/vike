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
 * We discard the information that the import variable is called `someImport` because we don't need it.
 */
function addImportStatement(
  importPath: string,
  importStatements: string[],
  exportName?: string
): { importName: string } {
  const varCounter = importStatements.length + 1
  const importName = `import_${varCounter}` as const
  const importLiteral = (() => {
    if (!exportName || exportName === '*') {
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
