export { isViteCli }
export { getViteCliArgs }
export { getViteBuildCliArgs }
export { getViteCliCommand }

// Copied from Vite's CLI

import { assert } from '../../../utils/assert.js'
import { isObject } from '../../../utils/isObject.js'
import { isToolCli } from '../../../utils/isToolCli.js'
import { cac } from 'cac'
import '../assertEnvVite.js'

const desc = 'vike:vite-cli-simulation'

function isViteCli(): boolean {
  return isToolCli('vite')
}

type ConfigFromCli = { root: undefined | string; configFile: undefined | string } & Record<string, unknown> & {
    build: Record<string, unknown>
  }

type ViteCommand = 'dev' | 'build' | 'optimize' | 'preview'
type ViteCli = { command: ViteCommand; root: string | undefined; options: Record<string, unknown> }
function parseViteCli(): ViteCli {
  let viteCli: ViteCli | undefined
  const onCommand = (command: ViteCommand) => (root: unknown, options: unknown) => {
    assert(viteCli === undefined)
    assert(root === undefined || typeof root === 'string')
    assert(isObject(options))
    // Same as Vite: duplicated options => the last value wins
    for (const [key, value] of Object.entries(options)) {
      if (Array.isArray(value)) options[key] = value[value.length - 1]
    }
    assert(options.config === undefined || typeof options.config === 'string')
    viteCli = { command, root, options }
  }

  // We need to declare all Vite's options, otherwise cac consumes the next argument as the value of boolean options (e.g. `vite build --emptyOutDir some-root`).
  const cli = cac(desc)
  // Common configs
  cli
    .option('-c, --config <file>', desc)
    .option('--base <path>', desc)
    .option('-l, --logLevel <level>', desc)
    .option('--clearScreen', desc)
    .option('--configLoader <loader>', desc)
    .option('-d, --debug [feat]', desc)
    .option('-f, --filter <filter>', desc)
    .option('-m, --mode <mode>', desc)
  // dev
  cli
    .command('[root]', desc)
    .alias('serve')
    .alias('dev')
    .option('--host [host]', desc)
    .option('--port <port>', desc)
    .option('--open [path]', desc)
    .option('--cors', desc)
    .option('--strictPort', desc)
    .option('--force', desc)
    .option('--experimentalBundle', desc)
    // Options that this copy doesn't declare (e.g. added by newer Vite versions) are still validated by Vite's own CLI, which throws `Unknown option` for options Vite doesn't know
    .allowUnknownOptions()
    .action(onCommand('dev'))
  // build
  cli
    .command('build [root]', desc)
    .option('--target <target>', desc)
    .option('--outDir <dir>', desc)
    .option('--assetsDir <dir>', desc)
    .option('--assetsInlineLimit <number>', desc)
    .option('--ssr [entry]', desc)
    .option('--sourcemap [output]', desc)
    .option('--minify [minifier]', desc)
    .option('--manifest [name]', desc)
    .option('--ssrManifest [name]', desc)
    .option('--emptyOutDir', desc)
    .option('-w, --watch', desc)
    .option('--app', desc)
    .allowUnknownOptions()
    .action(onCommand('build'))
  // optimize
  cli.command('optimize [root]', desc).option('--force', desc).allowUnknownOptions().action(onCommand('optimize'))
  // preview
  cli
    .command('preview [root]', desc)
    .option('--host [host]', desc)
    .option('--port <port>', desc)
    .option('--strictPort', desc)
    .option('--open [path]', desc)
    .option('--outDir <dir>', desc)
    .allowUnknownOptions()
    .action(onCommand('preview'))

  cli.parse()
  assert(viteCli)
  return viteCli
}

function getViteCliCommand(): ViteCommand | null {
  if (!isViteCli()) return null
  return parseViteCli().command
}

function getViteCliArgs(): null | { root: string | undefined; configFile: string | undefined } {
  if (!isViteCli()) return null
  const { root, options } = parseViteCli()
  return { root, configFile: options.config as string | undefined }
}

function getViteBuildCliArgs(): null | ConfigFromCli {
  if (!isViteCli()) return null
  const { command, root, options } = parseViteCli()
  if (command !== 'build') return null

  // Like Vite: all options except the global ones go to `build`
  const buildOptions = cleanGlobalCLIOptions(cleanBuilderCLIOptions(options))
  return {
    root,
    base: options.base,
    mode: options.mode,
    configFile: options.config as string | undefined,
    configLoader: options.configLoader,
    logLevel: options.logLevel,
    clearScreen: options.clearScreen,
    build: buildOptions,
    ...(options.app ? { builder: {} } : {}),
  }

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
  function cleanBuilderCLIOptions(options: Record<string, unknown>) {
    const ret = { ...options }
    delete ret.app
    return ret
  }
}
