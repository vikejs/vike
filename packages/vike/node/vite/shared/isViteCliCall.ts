export { isViteCliCall }
export { getViteConfigFromCli }
export { getViteCommandFromCli }

import { assert, isObject, toPosixPath } from '../utils.js'
import { cac } from 'cac'

const desc = 'vike:vite-cli-simulation'

// TODO/now: rename_full isViteCliCall isViteCli
function isViteCliCall(): boolean {
  let execPath = process.argv[1]
  assert(execPath)
  execPath = toPosixPath(execPath)
  return (
    // pnpm
    execPath.endsWith('/bin/vite.js') ||
    // npm & yarn
    execPath.endsWith('/.bin/vite') ||
    // Global install
    execPath.endsWith('/bin/vite')
  )
}

type ConfigFromCli = { root: undefined | string; configFile: undefined | string } & Record<string, unknown> & {
    build: Record<string, unknown>
  }

type ViteCommand = 'dev' | 'build' | 'optimize' | 'preview'
function getViteCommandFromCli(): ViteCommand | null {
  if (!isViteCliCall()) return null

  let command: ViteCommand | undefined
  const setCommand = (cmd: ViteCommand) => {
    assert(command === undefined)
    command = cmd
  }

  // Copied & adapted from Vite
  // https://github.com/vitejs/vite/blob/d3e7eeefa91e1992f47694d16fe4dbe708c4d80e/packages/vite/src/node/cli.ts#L186-L188
  const cli = cac(desc)
  // dev
  cli
    .command('[root]', desc)
    .alias('serve')
    .alias('dev')
    .action(() => {
      setCommand('dev')
    })
  // build
  cli.command('build [root]', desc).action(() => {
    setCommand('build')
  })
  // optimize
  cli.command('optimize [root]', desc).action(() => {
    setCommand('optimize')
  })
  // preview
  cli.command('preview [root]', desc).action(() => {
    setCommand('preview')
  })

  cli.parse()
  assert(command)

  return command
}

// TODO/now rename getViteConfigFromCli getViteConfigForBuildFromCli
function getViteConfigFromCli(): null | ConfigFromCli {
  if (!isViteCliCall()) return null

  // Copied & adapted from Vite
  const cli = cac(desc)
  // Common configs
  // https://github.com/vitejs/vite/blob/d3e7eeefa91e1992f47694d16fe4dbe708c4d80e/packages/vite/src/node/cli.ts#L169-L182
  cli
    .option('-c, --config <file>', desc)
    .option('--base <path>', desc)
    .option('-l, --logLevel <level>', desc)
    .option('--clearScreen', desc)
    .option('--configLoader <loader>', desc)
    .option('-d, --debug [feat]', desc)
    .option('-f, --filter <filter>', desc)
    .option('-m, --mode <mode>', desc)
  // Build configs
  // https://github.com/vitejs/vite/blob/d3e7eeefa91e1992f47694d16fe4dbe708c4d80e/packages/vite/src/node/cli.ts#L286-L322
  cli
    .command('build [root]', desc)
    .option('--target <target>', desc)
    .option('--outDir <dir>', desc)
    .option('--assetsDir <dir>', desc)
    .option('--assetsInlineLimit <number>', desc)
    .option('--ssr [entry]', desc)
    .option('--sourcemap', desc)
    .option('--minify [minifier]', desc)
    .option('--manifest [name]', desc)
    .option('--ssrManifest [name]', desc)
    .option('--emptyOutDir', desc)
    .option('-w, --watch', desc)
    .option('--app', desc)
    .action((root: unknown, options: unknown) => {
      assert(isObject(options))
      assert(root === undefined || typeof root === 'string')
      assert(options.config === undefined || typeof options.config === 'string')
      // https://github.com/vitejs/vite/blob/d3e7eeefa91e1992f47694d16fe4dbe708c4d80e/packages/vite/src/node/cli.ts#L331-L346
      const buildOptions = cleanGlobalCLIOptions(cleanBuilderCLIOptions(options))
      configFromCli = {
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
        configLoader: options.configLoader,
        logLevel: options.logLevel,
        clearScreen: options.clearScreen,
        build: buildOptions,
        ...(options.app ? { builder: {} } : {}),
      }
    })

  let configFromCli: ConfigFromCli | null = null
  cli.parse()

  return configFromCli

  // https://github.com/vitejs/vite/blob/d3e7eeefa91e1992f47694d16fe4dbe708c4d80e/packages/vite/src/node/cli.ts#L99
  function cleanGlobalCLIOptions(options: Record<string, unknown>) {
    const ret = { ...options }
    delete ret['--']
    delete ret.c
    delete ret.config
    delete ret.base
    delete ret.l
    delete ret.logLevel
    delete ret.clearScreen
    delete ret.configLoader
    delete ret.d
    delete ret.debug
    delete ret.f
    delete ret.filter
    delete ret.m
    delete ret.mode
    delete ret.force
    delete ret.w

    // convert the sourcemap option to a boolean if necessary
    if ('sourcemap' in ret) {
      const sourcemap = ret.sourcemap as `${boolean}` | 'inline' | 'hidden'
      ret.sourcemap = sourcemap === 'true' ? true : sourcemap === 'false' ? false : ret.sourcemap
    }
    if ('watch' in ret) {
      const watch = ret.watch
      ret.watch = watch ? {} : undefined
    }

    return ret
  }
  // https://github.com/vitejs/vite/blob/d3e7eeefa91e1992f47694d16fe4dbe708c4d80e/packages/vite/src/node/cli.ts#L141
  function cleanBuilderCLIOptions(options: Record<string, unknown>) {
    const ret = { ...options }
    delete ret.app
    return ret
  }
}
