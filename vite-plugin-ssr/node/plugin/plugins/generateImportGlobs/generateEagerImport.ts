export { generateEagerImport }

let varCounter = 0

function generateEagerImport(importPath: string): { importVar: string; importCode: string } {
  const importVar = `__import_${varCounter++}`
  const importCode = `import * as ${importVar} from '${importPath}';`
  return { importVar, importCode }
}
