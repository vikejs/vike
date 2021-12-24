import { cac } from 'cac'
import { resolve } from 'path'
import { prerender } from '../prerender'
import { projectInfo, assertUsage } from '../../shared/utils'

const cli = cac(projectInfo.projectName)

cli
  .command('prerender', 'Pre-render the HTML of your pages', { allowUnknownOptions: true })
  .option('--partial', 'Allow only a subset of pages to be pre-rendered')
  .option(
    '--noExtraDir',
    'Do not create a new directory for each page, e.g. generate `dist/client/about.html` instead of `dist/client/about/index.html`',
  )
  .option(
    '--root <path>',
    '[string] The root directory of your project (where `vite.config.js` live) (default: `process.cwd()`)',
  )
  .option('--outDir <path>', '[string] The build directory of your project (default: `dist`)')
  .option('--base <path>', '[string] Public base path (default: /)')
  .option(
    '--parallel <numberOfJobs>',
    '[number] Number of jobs running in parallel. Default: `os.cpus().length`. Set to `1` to disable concurrency.',
  )
  .action(async (options) => {
    assertOptions()
    const { partial, noExtraDir, base, parallel, outDir } = options
    const root = options.root && resolve(options.root)
    await prerender({ partial, noExtraDir, base, root, parallel, outDir })
  })

function assertOptions() {
  // We use `rawOptions` because `cac` maps option names to camelCase
  const rawOptions = process.argv.slice(3)
  assertUsage(!rawOptions.includes('--no-extra-dir'), '`--no-extra-dir` has been renamed: use `--noExtraDir` instead.')
  Object.values(rawOptions).forEach((option) => {
    assertUsage(
      !option.startsWith('--') ||
        ['--root', '--partial', '--noExtraDir', '--clientRouter', '--base', '--parallel', '--outDir'].includes(option),
      'Unknown option: ' + option,
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
