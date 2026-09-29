export { isViteCli }
export { getViteCliArgs }
export { getViteBuildCliArgs }
export { getViteCliCommand }

import { assert } from '../../../utils/assert.js'
import { isObject } from '../../../utils/isObject.js'
import { isToolCli } from '../../../utils/isToolCli.js'
import { cac } from 'cac'
import '../assertEnvVite.js'

const desc = 'vike:vite-cli-simulation'
// Vite's boolean options: we declare them because cac would otherwise consume the next argument as their value, e.g. `vite --strictPort build` or `vite build --emptyOutDir some-root`.
// https://github.com/vitejs/vite/blob/main/packages/vite/src/node/cli.ts
const viteBooleanOptions = [
  '--clearScreen',
  '--cors',
  '--strictPort',
  '--force',
  '--emptyOutDir',
  '-w, --watch',
  '--app',
  '--experimentalBundle',
]
function addViteBooleanOptions(cli: ReturnType<typeof cac>) {
  viteBooleanOptions.forEach((option) => cli.option(option, desc))
}

function isViteCli(): boolean {
  return isToolCli('vite')
}

type ConfigFromCli = { root: undefined | string; configFile: undefined | string } & Record<string, unknown> & {
    build: Record<string, unknown>
  }

type ViteCommand = 'dev' | 'build' | 'optimize' | 'preview'
function getViteCliCommand(): ViteCommand | null {
  if (!isViteCli()) return null

  let command: ViteCommand | undefined
  const setCommand = (cmd: ViteCommand) => {
    assert(command === undefined)
    command = cmd
  }

  // Copied & adapted from Vite
  // https://github.com/vitejs/vite/blob/d3e7eeefa91e1992f47694d16fe4dbe708c4d80e/packages/vite/src/node/cli.ts#L186-L188
  // - We only read the command: `.allowUnknownOptions()` so that Vite's options (e.g. `--port`) don't throw `Unknown option`.
  const cli = cac(desc)
  addViteBooleanOptions(cli)
  // dev
  cli
    .command('[root]', desc)
    .alias('serve')
    .alias('dev')
    .allowUnknownOptions()
    .action(() => {
      setCommand('dev')
    })
  // build
  cli
    .command('build [root]', desc)
    .allowUnknownOptions()
    .action(() => {
      setCommand('build')
    })
  // optimize
  cli
    .command('optimize [root]', desc)
    .allowUnknownOptions()
    .action(() => {
      setCommand('optimize')
    })
  // preview
  cli
    .command('preview [root]', desc)
    .allowUnknownOptions()
    .action(() => {
      setCommand('preview')
    })

  cli.parse()
  assert(command)

  return command
}

function getViteBuildCliArgs(): null | ConfigFromCli {
  if (!isViteCli()) return null

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
    // Don't throw upon options added by newer Vite versions
    .allowUnknownOptions()
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

function getViteCliArgs(): null | { root: string | undefined; configFile: string | undefined } {
  if (!isViteCli()) return null

  const cli = cac(desc)
  cli.option('-c, --config <file>', desc)
  addViteBooleanOptions(cli)

  let result: { root: string | undefined; configFile: string | undefined } | null = null
  const setResult = (root: unknown, options: unknown) => {
    assert(root === undefined || typeof root === 'string')
    assert(isObject(options))
    assert(options.config === undefined || typeof options.config === 'string')
    result = { root, configFile: options.config }
  }
  // We only read `[root]` and `-c`: `.allowUnknownOptions()` so that Vite's other options don't throw `Unknown option`.
  cli.command('[root]', desc).alias('serve').alias('dev').allowUnknownOptions().action(setResult)
  cli.command('build [root]', desc).allowUnknownOptions().action(setResult)
  cli.command('optimize [root]', desc).allowUnknownOptions().action(setResult)
  cli.command('preview [root]', desc).allowUnknownOptions().action(setResult)

  cli.parse()
  return result
}
