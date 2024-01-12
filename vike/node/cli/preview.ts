export { preview }

import pc from '@brillout/picocolors'
import { InlineConfig, ServerOptions, preview as previewVite, resolveConfig } from 'vite'
import { GlobalCLIOptions, cleanOptions, projectInfo } from './utils.js'
const { projectName, projectVersion } = projectInfo

async function preview(root: string, options: ServerOptions & GlobalCLIOptions) {
  const serverOptions: ServerOptions = cleanOptions(options)
  const inlineConfig: InlineConfig = {
    root,
    base: options.base,
    mode: options.mode,
    configFile: options.config,
    logLevel: options.logLevel,
    clearScreen: options.clearScreen,
    preview: serverOptions
  }
  const initialConfig = await resolveConfig(inlineConfig, 'serve').catch((error) => {
    console.error(pc.red(`error resolving config:\n${error.stack}`), {
      error
    })
    process.exit(1)
  })

  try {
    const server = await previewVite(inlineConfig)
    server.printUrls()
    server.bindCLIShortcuts({ print: true })
  } catch (e: any) {
    initialConfig.logger.error(pc.red(`error when starting preview server:\n${e.stack}`), {
      error: e
    })
    process.exit(1)
  }
}
