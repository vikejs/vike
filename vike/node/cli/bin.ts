import { cac } from 'cac'
import { resolve } from 'path'
import { runPrerenderFromCLI, runPrerender_forceExit } from '../prerender/runPrerender.js'
import { projectInfo, assertUsage, assertWarning } from './utils.js'
import pc from '@brillout/picocolors'
import { startDevServer } from '../dev/serverEntry.js'

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

cli.command('dev', 'Start the development server', { allowUnknownOptions: true }).action((options) => {
  startDevServer()
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

process.on('unhandledRejection', (rejectValue) => {
  throw rejectValue
})
