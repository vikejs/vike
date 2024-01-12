import { cac } from 'cac'
import { BuildOptions, ServerOptions } from 'vite'
import { GlobalCLIOptions, assertUsage, projectInfo } from './utils.js'

const cli = cac(projectInfo.projectName)
export const startTime = performance.now()

cli
  .option('-c, --config <file>', `[string] use specified config file`)
  .option('--base <path>', `[string] public base path (default: /)`)
  .option('-l, --logLevel <level>', `[string] info | warn | error | silent`)
  .option('--clearScreen', `[boolean] allow/disable clear screen when logging`)
  .option('-d, --debug [feat]', `[string | boolean] show debug logs`)
  .option('-f, --filter <filter>', `[string] filter debug logs`)
  .option('-m, --mode <mode>', `[string] set env mode`)

cli
  .command('prerender', 'Pre-render the HTML of your pages', { allowUnknownOptions: true })
  .option('--configFile <path>', '[string] Path to vite.config.js')
  .action(async (options) => {
    const { prerender } = await import('./prerender.js')
    return prerender(options)
  })

cli
  .command('[root]', 'Start the development server')
  .alias('serve')
  .alias('dev')
  .option('--host [host]', `[string] specify hostname`)
  .option('--port <port>', `[number] specify port`)
  .option('--open [path]', `[boolean | string] open browser on startup`)
  .option('--cors', `[boolean] enable CORS`)
  .option('--strictPort', `[boolean] exit if specified port is already in use`)
  .option('--force', `[boolean] force the optimizer to ignore the cache and re-bundle`)
  .action(async (root, options) => {
    const { serve } = await import('./serve.js')
    return serve(root, options)
  })

cli
  .command('build [root]', 'Build for production')
  .option('--target <target>', `[string] transpile target (default: 'modules')`)
  .option('--outDir <dir>', `[string] output directory (default: dist)`)
  .option('--assetsDir <dir>', `[string] directory under outDir to place assets in (default: _assets)`)
  .option('--assetsInlineLimit <number>', `[number] static asset base64 inline threshold in bytes (default: 4096)`)
  .option('--ssr [entry]', `[string] build specified entry for server-side rendering`)
  .option('--sourcemap', `[boolean] output source maps for build (default: false)`)
  .option(
    '--minify [minifier]',
    `[boolean | "terser" | "esbuild"] enable/disable minification, ` + `or specify minifier to use (default: esbuild)`
  )
  .option('--manifest', `[boolean] emit build manifest json`)
  .option('--ssrManifest', `[boolean] emit ssr manifest json`)
  .option('--emptyOutDir', `[boolean] force empty outDir when it's outside of root`)
  .option('-w, --watch', `[boolean] rebuilds when modules have changed on disk`)
  .action(async (root: string, options: BuildOptions & GlobalCLIOptions) => {
    const { build } = await import('./build.js')
    return build(root, options)
  })

cli
  .command('preview [root]', 'Start a preview server using production build')
  .option('--host [host]', `[string] specify hostname`)
  .option('--port <port>', `[number] specify port`)
  .option('--https', `[boolean] use TLS + HTTP/2`)
  .option('--open [path]', `[boolean | string] open browser on startup`)
  .option('--cors', `[boolean] enable CORS`)
  .option('--strictPort', `[boolean] exit if specified port is already in use`)
  .action(async (root: string, options: ServerOptions & GlobalCLIOptions) => {
    const { preview } = await import('./preview.js')
    return preview(root, options)
  })

// Listen to unknown commands
cli.on('command:*', () => {
  assertUsage(false, 'Unknown command: ' + cli.args.join(' '))
})

cli.help()
cli.version(projectInfo.projectVersion)

cli.parse()

process.on('unhandledRejection', (rejectValue) => {
  throw rejectValue
})
