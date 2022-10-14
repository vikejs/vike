import { toPosixPath } from '../utils'

export { isViteCliCall }

function isViteCliCall({ command, ssr }: { command?: 'build' | 'dev' | 'preview'; ssr?: true } = {}) {
  const { isViteCli, viteCliCommand, viteCliArgs } = analyzise()

  if (!isViteCli) {
    return false
  }

  if (ssr && !viteCliArgs.includes('--ssr')) {
    return false
  }

  if (command) {
    if (command === 'dev') {
      if (!['dev', 'serve', ''].includes(viteCliCommand)) {
        return false
      }
    } else {
      if (command !== viteCliCommand) {
        return false
      }
    }
  }

  return true
}

function analyzise() {
  const { argv } = process

  const viteCliArgs: string[] = []
  let viteCliCommand: string = ''

  let isViteCli = false
  for (const arg of argv) {
    if (isViteCli) {
      if (arg.startsWith('-')) {
        viteCliArgs.push(arg)
      } else {
        if (viteCliArgs.length === 0) {
          viteCliCommand = arg
        }
      }
    } else {
      const a = toPosixPath(arg)
      if (
        // pnpm
        a.endsWith('/bin/vite.js') ||
        // npm & yarn
        a.endsWith('/.bin/vite')
      ) {
        isViteCli = true
      }
    }
  }

  return { isViteCli, viteCliArgs, viteCliCommand }
}
