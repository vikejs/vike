import { toPosixPath } from '../utils'

export { isViteCliCall }

function isViteCliCall({ command, ssr }: { command: 'build' | 'dev' | 'preview'; ssr?: true }) {
  const { argv } = process
  if (!argv.some((a) => toPosixPath(a).endsWith('/bin/vite.js'))) {
    return false
  }
  if (ssr && !argv.includes('--ssr')) {
    return false
  }
  if (!argv.includes(command)) {
    if (command === 'dev') {
      return argv.includes('serve')
    }
    return false
  }
  return true
}
