import { cac } from 'cac'
import { resolve } from 'path'
import { prerender } from '../prerender'
import { projectInfo, assertUsage, assertWarning } from '../utils'

const cli = cac(projectInfo.projectName)

cli
  .command('prerender', 'Pre-render the HTML of your pages', { allowUnknownOptions: true })
  .option('--configFile <path>', '[string] Path to `vite.config.js`.')
  .action(async (options) => {
    assertWarning(
      false,
      'The `$ vite-plugin-ssr prerender` CLI is deprecated. It is superseded by setting the new `vite.config.js` option `prerender` (`$ vite build` will then automatically run pre-rendering). See https://vite-plugin-ssr.com/prerender for more information.',
      { onlyOnce: true },
    )
    assertOptions()
    const { partial, noExtraDir, base, parallel, outDir, configFile } = options
    const root = options.root && resolve(options.root)
    await prerender({ partial, noExtraDir, base, root, parallel, outDir, configFile })
  })

function assertOptions() {
  // We use `rawOptions` because `cac` maps option names to camelCase
  const rawOptions = process.argv.slice(3)
  assertUsage(!rawOptions.includes('--no-extra-dir'), '`--no-extra-dir` has been renamed: use `--noExtraDir` instead.')
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
          '--configFile',
        ].includes(option),
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
