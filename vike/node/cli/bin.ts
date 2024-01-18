import { cac } from 'cac'
import { projectInfo } from '../../utils/projectInfo.js'
import { assertUsage } from '../../utils/assert.js'
import { setCliCall, type Options } from '../api/utils.js'

setCliCall()

const cli = cac(projectInfo.projectName)
export const startTime = performance.now()

cli.option('-c, --config [string]', `[string] use specified config`)

cli.command('prerender', 'Pre-render the HTML of your pages', { allowUnknownOptions: true }).action(async (options) => {
  const config = parseConfigString(options.config)
  //TODO: remove flags in favor of options.config.prerender
  if (!options.config) {
    assertDeprecatedPrerenderOptions()
  }
  const prerenderConfig = config.prerender ?? options
  const { prerender } = await import('../api/prerender.js')
  await prerender({
    ...prerenderConfig,
    viteConfig: config.vite
  })
})

cli
  .command('', 'Start the development server')
  .alias('serve')
  .alias('dev')
  .action(async (options) => {
    const config = parseConfigString(options.config)
    const { serve } = await import('../api/serve.js')
    return serve(config)
  })

cli.command('build', 'Build for production').action(async (options) => {
  const config = parseConfigString(options.config)
  const { build } = await import('../api/build.js')
  return build(config)
})

cli.command('preview', 'Start a preview server using production build').action(async (options) => {
  const config = parseConfigString(options.config)
  const { preview } = await import('../api/preview.js')
  return preview(config)
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

function parseConfigString(configString?: string): Options {
  if (!configString) {
    return {}
  }
  const config = eval(`(${configString})`)
  return config
}

function assertDeprecatedPrerenderOptions() {
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
  })
}
