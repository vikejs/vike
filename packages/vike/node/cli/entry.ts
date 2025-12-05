import { colorVike, colorVite, PROJECT_VERSION } from './utils.js'
import { dev, build, preview } from '../api/index.js'
import pc from '@brillout/picocolors'
import { parseCli } from './parseCli.js'
import { setContextCliCommand } from './context.js'

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
  const startTime = performance.now()
  try {
      // Suppress "[vite] connected." message by monkey patching console.log before server starts
      const originalConsoleLog = console.log
      console.log = function(...args: any[]) {
        const msg = args.join(' ')
        // process.stdout.write('III' + msg)
        // Strict check: match exactly "[vite] connected." message from HMR client
        if (msg === '[vite] connected.') {
          return
        }
        originalConsoleLog.apply(console, args)
      }
    const { viteServer, viteVersion } = await dev()

    if (viteServer.httpServer) {
      await viteServer.listen()

      // Restore console.log before printing welcome message
      console.log = originalConsoleLog

      const info = viteServer.config.logger.info
      const startupDurationString = pc.dim(
        `ready in ${pc.reset(pc.bold(String(Math.ceil(performance.now() - startTime))))} ms`,
      )
      const logWelcome =
        `  ${colorVike('Vike')} ${pc.yellow(`v${PROJECT_VERSION}`)} ${pc.dim('/')} ${colorVite('VITE')} ${pc.cyan(`v${viteVersion}`)} ${pc.dim('/')} ${startupDurationString}\n` as const
      
    {
      const hasExistingLogs = process.stdout.bytesWritten > 0 || process.stderr.bytesWritten > 0
      console.log('hasExistingLogs', hasExistingLogs)
    }

      // Respect user's clearScreen setting
      if (true) {
        viteServer.config.logger.clearScreen('info')
      }
      info(logWelcome, { timestamp: true })

      viteServer.printUrls()
    } else {
      // vike-server => middleware mode => `viteServer.httpServer === null`
    }

    viteServer.bindCLIShortcuts({ print: true })
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
