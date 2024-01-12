export { build }

import { InlineConfig, BuildOptions, build as buildVite, resolveConfig } from 'vite'
import { GlobalCLIOptions, cleanOptions } from './utils.js'
import pc from '@brillout/picocolors'

async function build(root: string, options: BuildOptions & GlobalCLIOptions) {
  const buildOptions: BuildOptions = cleanOptions(options)
  const inlineConfig: InlineConfig = {
    root,
    base: options.base,
    mode: options.mode,
    configFile: options.config,
    logLevel: options.logLevel,
    clearScreen: options.clearScreen,
    build: buildOptions
  }

  // TODO: if this is run, prerender throws TypeError: jsxDEV is not a function
  // const initialConfig = await resolveConfig(inlineConfig, 'build').catch((error) => {
  //   console.error(pc.red(`error resolving config:\n${error.stack}`), {
  //     error
  //   })
  //   process.exit(1)
  // })

  // function isViteCliCall() {
  //   let execPath = process.argv[1]
  //   assert(execPath)
  //   execPath = toPosixPath(execPath)
  //   return (
  //     // pnpm
  //     execPath.endsWith('/bin/vite.js') ||
  //     // npm & yarn
  //     execPath.endsWith('/.bin/vite') ||
  //     // Global install
  //     execPath.endsWith('/bin/vite') ||
  //
  //     isVikeCliCall()  <-----------------------------------------------------------
  //   )
  // }

  await buildVite(inlineConfig).catch((error) => {
    // initialConfig.logger.error(pc.red(`error during build:\n${error.stack}`), { error })
    process.exit(1)
  })
}
