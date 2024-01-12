export { serve }

import pc from '@brillout/picocolors'
import { InlineConfig, ServerOptions, createServer, resolveConfig } from 'vite'
import { startTime } from './bin.js'
import { GlobalCLIOptions, cleanOptions, projectInfo } from './utils.js'
const { projectName, projectVersion } = projectInfo

async function serve(root: string, options: ServerOptions & GlobalCLIOptions) {
  const serverOptions: ServerOptions = cleanOptions(options)
  const inlineConfig: InlineConfig = {
    root,
    base: options.base,
    mode: options.mode,
    configFile: options.config,
    logLevel: options.logLevel,
    clearScreen: options.clearScreen,
    server: serverOptions
  }
  const initialConfig = await resolveConfig(inlineConfig, 'serve').catch((error) => {
    console.error(pc.red(`error resolving config:\n${error.stack}`), {
      error
    })
    process.exit(1)
  })

  try {
    const server = await createServer(inlineConfig)
    await server.listen()
    const info = server.config.logger.info
    const startupDurationString = pc.dim(
      `ready in ${pc.reset(pc.bold(String(Math.ceil(performance.now() - startTime))))} ms`
    )
    const hasExistingLogs = process.stdout.bytesWritten > 0 || process.stderr.bytesWritten > 0
    info(`\n  ${pc.cyan(`${pc.bold(projectName)} v${projectVersion}`)}  ${startupDurationString}\n`, {
      clear: !hasExistingLogs
    })

    server.printUrls()
    server.bindCLIShortcuts({ print: true })
  } catch (e: any) {
    initialConfig.logger.error(pc.red(`error when starting dev server:\n${e.stack}`), {
      error: e
    })
    process.exit(1)
  }
}
