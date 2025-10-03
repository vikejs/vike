export { isViteCliCall }
export { getViteConfigFromCli }

import { assert, isObject, toPosixPath } from '../utils.js'
import { cac } from 'cac'

// TODO: rename_full isViteCliCall isViteCli
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
function getViteConfigFromCli(): null | ConfigFromCli {
  if (!isViteCliCall()) return null

  // Copied and adapted from Vite
  const desc = 'vike:vite-cli-simulation'
  const cli = cac(desc)
  // Common configs: https://github.com/vitejs/vite/blob/d3e7eeefa91e1992f47694d16fe4dbe708c4d80e/packages/vite/src/node/cli.ts#L169-L182
  cli
    .option('-c, --config <file>', desc)
    .option('--base <path>', desc)
    .option('-l, --logLevel <level>', desc)
    .option('--clearScreen', desc)
    .option('--configLoader <loader>', desc)
    .option('-d, --debug [feat]', desc)
    .option('-f, --filter <filter>', desc)
    .option('-m, --mode <mode>', desc)
  // Build configs: https://github.com/vitejs/vite/blob/d3e7eeefa91e1992f47694d16fe4dbe708c4d80e/packages/vite/src/node/cli.ts#L286-L322
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
      const buildOptions = cleanOptions(options)
      assert(root === undefined || typeof root === 'string')
      assert(options.config === undefined || typeof options.config === 'string')
      configFromCli = {
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
        logLevel: options.logLevel,
        clearScreen: options.clearScreen,
        optimizeDeps: { force: options.force },
        build: buildOptions,
      }
    })

  let configFromCli: ConfigFromCli | null = null
  cli.parse()

  return configFromCli

  function cleanOptions(options: Record<string, unknown>) {
    const ret = { ...options }
    delete ret['--']
    delete ret.c
    delete ret.config
    delete ret.base
    delete ret.l
    delete ret.logLevel
    delete ret.clearScreen
    delete ret.d
    delete ret.debug
    delete ret.f
    delete ret.filter
    delete ret.m
    delete ret.mode
    return ret
  }
}
