export { isToolCli }

import { toPosixPath } from './path.js'

function isToolCli(tool: 'vite' | 'storybook'): boolean {
  let execPath = process.argv[1]
  // No script, e.g. `$ node -e` or Node.js's REPL
  if (!execPath) return false
  execPath = toPosixPath(execPath)
  return !!execPath.split('node_modules/').at(-1)?.startsWith(`${tool}/`)
}
