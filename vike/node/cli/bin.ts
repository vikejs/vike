import { projectInfo } from './utils.js'
import { dev, build, preview } from '../api/index.js'
import pc from '@brillout/picocolors'
import { parseCli } from './parseCli.js'
import type { Config } from '../../types/index.js'
import { runPrerender_forceExit } from '../prerender/runPrerender.js'

cli()

async function cli() {
  const {
    command,
    options: { configDefinedByCli }
  } = parseCli()
  if (command === 'dev') {
    await cmdDev(configDefinedByCli)
  } else if (command === 'build') {
    await cmdBuild(configDefinedByCli)
  } else if (command === 'preview') {
    await cmdPreview(configDefinedByCli)
  } else if (command === 'prerender') {
    await cmdPrerender(configDefinedByCli)
  }
}

async function cmdDev(configDefinedByCli: Config) {
  const startTime = performance.now()
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
  } catch (err) {
    console.error(pc.red(`Error while starting dev server:`))
    console.error(err)
    process.exit(1)
  }
}

async function cmdBuild(configDefinedByCli: Config) {
  try {
    await build()
  } catch (err) {
    console.error(pc.red(`Error during build:`))
    console.error(err)
    process.exit(1)
  }
}

async function cmdPreview(configDefinedByCli: Config) {
  try {
    const server = await preview()
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
  } catch (err) {
    console.error(pc.red(`Error while starting preview server:`))
    console.error(err)
    process.exit(1)
  }
}

async function cmdPrerender(configDefinedByCli: Config) {
  const { runPrerenderFromCLIPrerenderCommand } = await import('../prerender/runPrerender.js')
  await runPrerenderFromCLIPrerenderCommand()
  runPrerender_forceExit()
}

process.on('unhandledRejection', (rejectValue) => {
  throw rejectValue
})
