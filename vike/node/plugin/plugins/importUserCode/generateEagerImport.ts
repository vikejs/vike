export { generateEagerImport }

let varCounterGlobal = 0

function generateEagerImport(
  importPath: string,
  varCounter?: number,
  exportName?: string
): { importVar: string; importStatement: string } {
  if (varCounter === undefined) varCounter = varCounterGlobal++
  const importVar = `import_${varCounter}` as const
  const importLiteral = (() => {
    if (!exportName || exportName === '*') {
      return `* as ${importVar}` as const
    }
    if (exportName === 'default') {
      return importVar
    }
    return `{ ${exportName} as ${importVar} }` as const
  })()
  const importStatement = `import ${importLiteral} from '${importPath}';`
  return { importVar, importStatement }
}
