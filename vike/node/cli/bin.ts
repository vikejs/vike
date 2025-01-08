import { cac } from 'cac'
import { projectInfo, assertUsage } from './utils.js'
import { setIsVikeCli } from '../api/isVikeCli.js'
import { serve, build, preview } from '../api/index.js'

setIsVikeCli()

const cli = cac(projectInfo.projectName)
export const startTime = performance.now()

cli.command('prerender', 'Pre-render the HTML of your pages').action(async () => {
  const { runPrerenderFromCLIStandalone } = await import('../prerender/runPrerender.js')
  await runPrerenderFromCLIStandalone()
})

cli
  .command('', 'Start the development server')
  .alias('serve')
  .alias('dev')
  .action(async () => {
    await serve()
  })

cli.command('build', 'Build for production').action(async () => {
  await build()
})

cli.command('preview', 'Start a preview server using production build').action(async () => {
  await preview()
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
