export { generateEagerImport }

let varCounterGlobal = 0

function generateEagerImport(
  importPath: string,
  varCounter?: number,
  exportName?: string
): { importName: string; importStatement: string } {
  if (varCounter === undefined) varCounter = varCounterGlobal++
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
  return { importName, importStatement }
}
