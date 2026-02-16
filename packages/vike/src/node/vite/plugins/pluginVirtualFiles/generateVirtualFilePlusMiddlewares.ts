export { generateVirtualFilePlusMiddlewares }

import '../../assertEnvVite.js'

function generateVirtualFilePlusMiddlewares(plusMiddlewares: string[]): string {
  if (plusMiddlewares.length === 0) return `export default []`
  const imports = plusMiddlewares.map((filePath, i) => `import m${i} from ${JSON.stringify(filePath)};`)
  const keys = plusMiddlewares.map((_, i) => `m${i}`)
  const code = `${imports.join('\n')}

export default [${keys.join(',')}];
`
  return code
}
