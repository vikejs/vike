export { isViteCliCall }
export { getConfigFromCli }

import { assert, toPosixPath } from '../utils'

function isViteCliCall({ command, ssr }: { command?: 'build' | 'dev' | 'preview'; ssr?: true } = {}) {
  const { isViteCli, viteCliCommand, viteCliArgs } = analyzise()

  if (!isViteCli) {
    return false
  }

  if (ssr && !viteCliArgs['ssr']) {
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

type CliArgVal = boolean | string

function analyzise() {
  const { argv } = process

  const viteCliArgs: Record<string, CliArgVal> = {}
  let viteCliCommand: string = ''

  let isViteCli = false
  let currentArgName: string | null = null
  let currentArgValues: string[] = []
  const currentArgAdd = () => {
    if (currentArgName) {
      viteCliArgs[currentArgName] = (() => {
        if (currentArgValues.length === 0) {
          return true
        }
        if (currentArgValues.length === 1) {
          const val = currentArgValues[0]
          if (val === 'false') {
            return false
          }
          if (val === 'true') {
            return true
          }
        }
        return currentArgValues.join(' ')
      })()
      currentArgName = null
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
      word = resolveCliArgName(word)
      assert(!word.startsWith('-'))
      currentArgAdd()
      currentArgName = word
    } else {
      if (Object.keys(viteCliArgs).length === 0 && currentArgName === null) {
        viteCliCommand = word
      } else {
        currentArgValues.push(word)
      }
    }
  }
  currentArgAdd()

  assert(currentArgName === null)
  return { isViteCli, viteCliArgs, viteCliCommand }
}

function resolveCliArgName(cliWord: string) {
  const shortHands = {
    '-w': 'watch',
    '-c': 'config',
    '-l': 'logLevel',
    '-d': 'debug',
    '-f': 'filter',
    '-m': 'mode',
    '-h': 'help'
  }
  if (cliWord in shortHands) {
    return shortHands[cliWord as keyof typeof shortHands]
  }
  assert(cliWord.startsWith('--'), cliWord)
  cliWord = cliWord.slice(2)
  return cliWord
}

type ConfigFromCli = Record<string, unknown> & { build: Record<string, unknown>; optimizeDeps: Record<string, unknown> }
function getConfigFromCli(): ConfigFromCli {
  const { isViteCli, viteCliCommand, viteCliArgs } = analyzise()
  assert(isViteCli)
  assert(viteCliCommand === 'build')

  const configFromCli: ConfigFromCli = { build: {}, optimizeDeps: {} }
  Object.entries(viteCliArgs).forEach(([name, val]) => {
    if (['mode', 'base', 'logLevel', 'clearScreen', 'debug', 'filter'].includes(name)) {
      configFromCli[name] = val
    } else if (['force'].includes(name)) {
      configFromCli.optimizeDeps[name] = val
    } else if ('config' === name) {
      configFromCli.configFile = val
    } else {
      configFromCli.build[name] = val
    }
  })

  return configFromCli
}
