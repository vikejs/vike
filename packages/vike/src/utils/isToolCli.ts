export { isToolCli }

import { toPosixPath } from './path.js'

function isToolCli(tool: 'vite'): boolean {
  let execPath = process.argv[1]!
  execPath = toPosixPath(execPath)
  return !!execPath.split('node_modules/').at(-1)?.startsWith(`${tool}/`)
}
