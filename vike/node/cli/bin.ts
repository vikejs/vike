import { cac } from 'cac'
import { projectInfo, assertUsage } from './utils.js'
import { dev, build, preview } from '../api/index.js'
import pc from '@brillout/picocolors'

const cli = cac(projectInfo.projectName)
const startTime = performance.now()

cli.command('prerender', 'Pre-render the HTML of your pages').action(async () => {
  const { runPrerenderFromCLIStandalone } = await import('../prerender/runPrerender.js')
  await runPrerenderFromCLIStandalone()
})

cli
  .command('', 'Start the development server')
  .alias('dev')
  .action(async () => {
    try {
      const server = await dev()

      await server.listen()
      const info = server.config.logger.info
      const startupDurationString = pc.dim(
        `ready in ${pc.reset(pc.bold(String(Math.ceil(performance.now() - startTime))))} ms`
      )
      const hasExistingLogs = process.stdout.bytesWritten > 0 || process.stderr.bytesWritten > 0
      info(
        `\n  ${pc.cyan(`${pc.bold(projectInfo.projectName)} v${projectInfo.projectVersion}`)}  ${startupDurationString}\n`,
        {
          clear: !hasExistingLogs
        }
      )

      server.printUrls()
      server.bindCLIShortcuts({ print: true })
      return server
    } catch (err) {
      console.error(pc.red(`Error while starting dev server:`))
      console.error(err)
      process.exit(1)
    }
  })

cli.command('build', 'Build for production').action(async () => {
  try {
    await build()
  } catch (err) {
    console.error(pc.red(`Error during build:`))
    console.error(err)
    process.exit(1)
  }
})

cli.command('preview', 'Start a preview server using production build').action(async () => {
  try {
    const server = await preview()
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
  } catch (err) {
    console.error(pc.red(`Error while starting preview server:`))
    console.error(err)
    process.exit(1)
  }
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
