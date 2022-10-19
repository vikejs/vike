export { isViteCliCall }
export { getViteBuildCliConfig }

import { assert, toPosixPath } from '../utils'
import { cac } from 'cac'

function isViteCliCall() {
  let execPath = process.argv[1]
  assert(execPath)
  execPath = toPosixPath(execPath)
  return (
    // pnpm
    execPath.endsWith('/bin/vite.js') ||
    // npm & yarn
    execPath.endsWith('/.bin/vite')
  )
}

// Copied and adapted from https://github.com/vitejs/vite/blob/8d0a9c1ab8ddd26973509ca230b29604e872e2cd/packages/vite/src/node/cli.ts#L137-L197
type BuildArgs = Record<string, unknown> & { build: Record<string, unknown> }
function getViteBuildCliConfig(): BuildArgs {
  const cli = cac('vite-plugin-ssr:vite-simulation')
  const desc = 'FAKE_CLI'

  cli
    .option('-c, --config <file>', desc)
    .option('--base <path>', desc)
    .option('-l, --logLevel <level>', desc)
    .option('--clearScreen', desc)
    .option('-d, --debug [feat]', desc)
    .option('-f, --filter <filter>', desc)
    .option('-m, --mode <mode>', desc)

  // build
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
    .option('--force', desc)
    .option('--emptyOutDir', desc)
    .option('-w, --watch', desc)
    .action((root: string, options: Record<string, unknown>) => {
      const buildOptions = cleanOptions(options)
      config = {
        root,
        base: options.base,
        mode: options.mode,
        configFile: options.config,
        logLevel: options.logLevel,
        clearScreen: options.clearScreen,
        optimizeDeps: { force: options.force },
        build: buildOptions
      }
    })

  let config!: BuildArgs
  cli.parse()
  assert(config)
  return config

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
