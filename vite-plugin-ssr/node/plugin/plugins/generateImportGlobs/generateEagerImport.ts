export { generateEagerImport }

let varCounterGlobal = 0

function generateEagerImport(importPath: string, varCounter?: number): { importVar: string; importStatement: string } {
  if (varCounter === undefined) varCounter = varCounterGlobal++
  const importVar = `__import_${varCounter}`
  const importStatement = `import * as ${importVar} from '${importPath}';`
  return { importVar, importStatement }
}
