import { debug } from './debug.js'

export { generateVirtualFilePlusMiddlewares }

import '../../assertEnvVite.js'

function generateVirtualFilePlusMiddlewares(plusMiddlewares: string[]): string {
  debug('+middleware size:', plusMiddlewares.length)
  const imports = plusMiddlewares.map((filePath, i) => `import m${i} from ${JSON.stringify(filePath)};`)
  const keys = plusMiddlewares.map((_, i) => `m${i}`)
  const code = `${imports.join('\n')}

export default [${keys.join(',')}];

if (import.meta.hot) import.meta.hot.accept();
`
  return code
}
