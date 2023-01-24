export { generateEagerImport }

let varCounter = 0

function generateEagerImport(importPath: string): { importVar: string; importStatement: string } {
  const importVar = `__import_${varCounter++}`
  const importStatement = `import * as ${importVar} from '${importPath}';`
  return { importVar, importStatement }
}
