export { generateEagerImport }

let varCounterGlobal = 0

function generateEagerImport(
  importPath: string,
  varCounter?: number,
  importName?: string
): { importVar: string; importStatement: string } {
  if (varCounter === undefined) varCounter = varCounterGlobal++
  const importVar = `import_${varCounter}` as const
  const importLiteral = (() => {
    if (!importName || importName === '*') {
      return `* as ${importVar}` as const
    }
    if (importName === 'default') {
      return importVar
    }
    return `{ ${importName} as ${importVar} }` as const
  })()
  const importStatement = `import ${importLiteral} from '${importPath}';`
  return { importVar, importStatement }
}
