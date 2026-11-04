export { isToolCli }

import { toPosixPath } from './path.js'

function isToolCli(tool: 'vite' | 'storybook'): boolean {
  let execPath = process.argv[1]
  // No script, e.g. `$ node -e` or Node.js's REPL
  if (!execPath) return false
  execPath = toPosixPath(execPath)
  const execPathInNodeModules = execPath.split('node_modules/').at(-1)!
  return (
    execPathInNodeModules.startsWith(`${tool}/`) ||
    // npm links the CLI as a symlink in `node_modules/.bin/`, and `process.argv[1]` keeps the symlink's path
    execPathInNodeModules === `.bin/${tool}`
  )
}
