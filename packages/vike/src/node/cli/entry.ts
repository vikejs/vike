import { dev, build, preview } from '../api/index.js'
import pc from '@brillout/picocolors'
import { parseCli } from './parseCli.js'
import { setContextCliCommand } from './context.js'
import './assertEnvCli.js'

cli()

async function cli() {
  const { command, cliOptions } = parseCli()
  setContextCliCommand(command, cliOptions)
  if (command === 'dev') {
    await cmdDev()
  } else if (command === 'build') {
    await cmdBuild()
  } else if (command === 'preview') {
    await cmdPreview()
  } else if (command === 'prerender') {
    await cmdPrerender()
  }
}

async function cmdDev() {
  try {
    await dev({ startupLog: true })
  } catch (err) {
    console.error(pc.red(`Error while starting dev server:`))
    // Error comes from Vite; no need to use addErrorHint()
    console.error(err)
    process.exit(1)
  }
}

async function cmdBuild() {
  try {
    await build()
  } catch (err) {
    console.error(pc.red(`Error during build:`))
    // Error comes from Vite; no need to use addErrorHint()
    console.error(err)
    process.exit(1)
  }
  // See comments at runPrerender_forceExit()
  process.exit(0)
}

async function cmdPreview() {
  try {
    const { viteServer } = await preview()
    if (viteServer) {
      viteServer.printUrls()
      viteServer.bindCLIShortcuts({ print: true })
    }
  } catch (err) {
    console.error(pc.red(`Error while starting preview server:`))
    // Error comes from Vite; no need to use addErrorHint()
    console.error(err)
    process.exit(1)
  }
}

async function cmdPrerender() {
  const { runPrerenderFromCLIPrerenderCommand } = await import('../prerender/runPrerenderEntry.js')
  await runPrerenderFromCLIPrerenderCommand()
}

process.on('unhandledRejection', (rejectValue) => {
  throw rejectValue
})
