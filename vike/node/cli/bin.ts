import { cac } from 'cac'
import { resolve } from 'path'
import { runPrerenderFromCLI, runPrerender_forceExit } from '../prerender/runPrerender.js'
import { projectInfo, assertUsage, assertWarning } from './utils.js'
import pc from '@brillout/picocolors'
import { startDevServer } from '../dev/serverEntry.js'

// @ts-ignore Shimmed by dist-cjs-fixup.js for CJS build.
const importMetaUrl: string = import.meta.url
const __dirname_ = path.dirname(fileURLToPath(importMetaUrl))
const cli = cac(projectInfo.projectName)

cli
  .command('prerender', 'Pre-render the HTML of your pages', { allowUnknownOptions: true })
  .option('--configFile <path>', '[string] Path to vite.config.js')
  .action(async (options) => {
    assertOptions()
    const { partial, noExtraDir, base, parallel, outDir, configFile } = options
    const root = options.root && resolve(options.root)
    await runPrerenderFromCLI({ partial, noExtraDir, base, root, parallel, outDir, configFile })
    runPrerender_forceExit()
  })

cli
  .command('[root]', 'Start the development server', { allowUnknownOptions: true })
  .alias('serve') // the command is called 'serve' in Vite's API
  .alias('dev') // alias to align with the script name
  .option('--host [host]', `[string] specify hostname`)
  .option('--port <port>', `[number] specify port`)
  .option('--open [path]', `[boolean | string] open browser on startup`)
  .option('--cors', `[boolean] enable CORS`)
  .option('--strictPort', `[boolean] exit if specified port is already in use`)
  .option('--force', `[boolean] force the optimizer to ignore the cache and re-bundle`)
  .action(async (root, options) => {
    logViteAny('Starting development server', 'info', null, true)

    await resolveConfig({}, 'serve')
    const serverConfig = getServerConfig()
    if (!serverConfig?.entry) {
      const command = ['dev']
      if (root) {
        command.push(root)
      }
      for (const [key, value] of Object.entries(options).slice(1)) {
        command.push(`--${key}=${value}`)
      }

      fork('node_modules/vite/bin/vite', command, { stdio: 'inherit' })
      return
    }

    const scriptPath = path.join(__dirname_, '..', 'dev/startDevServer.js')

    function onRestart() {
      const cp = fork(scriptPath, { stdio: 'inherit' })
      cp.once('exit', (code) => {
        if (code === 33) {
          onRestart()
        }
      })
    }

    onRestart()
  })

function assertOptions() {
  // Using process.argv because cac convert names to camelCase
  const rawOptions = process.argv.slice(3)
  Object.values(rawOptions).forEach((option) => {
    assertUsage(
      !option.startsWith('--') ||
        [
          '--root',
          '--partial',
          '--noExtraDir',
          '--clientRouter',
          '--base',
          '--parallel',
          '--outDir',
          '--configFile'
        ].includes(option),
      'Unknown option: ' + option
    )
    assertWarning(
      false,
      `You set ${pc.cyan(option)}, but passing options to ${pc.cyan(
        '$ vike prerender'
      )} is deprecated: use the config file instead. See https://vike.dev/command-prerender.`,
      { onlyOnce: true }
    )
  })
}

// Listen to unknown commands
cli.on('command:*', () => {
  assertUsage(false, 'Unknown command: ' + cli.args.join(' '))
})

cli.help()
cli.version(projectInfo.projectVersion)

cli.parse(process.argv.length === 2 ? [...process.argv, '--help'] : process.argv)
