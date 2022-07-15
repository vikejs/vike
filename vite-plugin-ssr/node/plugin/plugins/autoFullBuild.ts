export { autoFullBuild }

import { build, Plugin, ResolvedConfig } from 'vite'
import { assert, assertWarning, isSSR_config } from '../utils'
import { isViteCliCall } from '../helpers'
import { prerender } from '../../prerender'
import { assertConfigVpsResolved } from './config/assertConfigVps'
import type { ConfigVpsResolved } from './config/ConfigVps'

const triggedByAutoFullBuild = '__triggedByAutoFullBuild'

type Config = ResolvedConfig & { vitePluginSsr: ConfigVpsResolved }

function autoFullBuild(): Plugin {
  let config: Config
  return {
    name: 'vite-plugin-ssr:autoFullBuild',
    apply: 'build',
    configResolved(config_) {
      assertConfigVpsResolved(config_)
      config = config_
      abortSSRBuild(config)
    },
    async writeBundle() {
      if (config.vitePluginSsr.disableAutoFullBuild) {
        return
      }

      const { configFile, root } = config
      const isSSR = isSSR_config(config)

      if (!isSSR) {
        const configSSR = {
          build: { ssr: true },
          configFile,
          root,
          [triggedByAutoFullBuild as any]: true,
        }
        await build(configSSR)
      }

      if (
        isSSR &&
        istriggedByAutoFullBuild(config) &&
        config.vitePluginSsr.prerender &&
        !config.vitePluginSsr.prerender.disableAutoRun
      ) {
        await prerender({ viteConfig: { configFile, root } })
      }
    },
  }
}

function abortSSRBuild(config: Config) {
  if (config.vitePluginSsr.disableAutoFullBuild) {
    return
  }
  // CLI
  if (isViteCliCall({ command: 'build', ssr: true })) {
    abortCLI()
    assert(false)
  }
  // API
  if (isSSR_config(config) && !istriggedByAutoFullBuild(config)) {
    abortAPI()
    assert(false)
  }
}

function istriggedByAutoFullBuild(config: Record<string, unknown>) {
  return !!config[triggedByAutoFullBuild]
}

function abortCLI() {
  assertWarning(
    false,
    'The CLI call `$ vite build --ssr` is outdated. It has no effect and is superfluous. Use only the CLI call `$ vite build` instead (it now also builds the server-side code).',
    { onlyOnce: true },
  )
  process.exit(0)
}
function abortAPI() {
  assertWarning(
    false,
    'The Vite API call `await build({ build: { ssr: true } })` is outdated. It has no effect and is superfluous. Use only the Vite API call `await build()` (without `build.ssr`) instead, as it now also builds server-side code.',
    { onlyOnce: true },
  )
  process.exit(0)
}
