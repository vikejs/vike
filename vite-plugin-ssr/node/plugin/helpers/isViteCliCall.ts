export { isViteCliCall }

import { assert, toPosixPath } from '../utils'

function isViteCliCall({ command, ssr }: { command?: 'build' | 'dev' | 'preview'; ssr?: true } = {}) {
  const { isViteCli, viteCliCommand, viteCliArgs } = analyzise()

  if (!isViteCli) {
    return false
  }

  if (ssr && !viteCliArgs['--ssr']) {
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

  const viteCliArgs: Record<string, true | string> = {}
  let viteCliCommand: string = ''

  let isViteCli = false
  let currentArg: string | null = null
  let currentArgValues: string[] = []
  const currentArgAdd = () => {
    if (currentArg) {
      viteCliArgs[currentArg] = currentArgValues.length === 0 ? true : currentArgValues.join(' ')
      currentArg = null
      currentArgValues = []
    }
  }
  for (let word of argv) {
    if (!isViteCli) {
      word = toPosixPath(word)
      if (
        // pnpm
        word.endsWith('/bin/vite.js') ||
        // npm & yarn
        word.endsWith('/.bin/vite')
      ) {
        isViteCli = true
      }
      continue
    }

    assert(isViteCli)
    if (word.startsWith('-')) {
      currentArgAdd()
      currentArg = word
    } else {
      if (Object.keys(viteCliArgs).length === 0 && currentArg === null) {
        viteCliCommand = word
      } else {
        currentArgValues.push(word)
      }
    }
  }
  currentArgAdd()

  assert(currentArg === null)
  return { isViteCli, viteCliArgs, viteCliCommand }
}
