export { autoBuild }

import { build, Plugin, ResolvedConfig } from 'vite'
import { assert, assertWarning, isSSR_config, isViteCliCall } from '../utils'
import { prerender } from '../../prerender'
import { assertConfigVpsResolved } from './config/assertConfigVps'
import type { ConfigVpsResolved } from './config/ConfigVps'

const triggedByAutoBuild = '__triggedByAutoBuild'

type Config = ResolvedConfig & { vitePluginSsr: ConfigVpsResolved }

function autoBuild(): Plugin {
  let config: Config
  return {
    name: 'vite-plugin-ssr:autoBuild',
    apply: 'build',
    configResolved(config_) {
      assertConfigVpsResolved(config_)
      config = config_
      abortSSRBuild(config)
    },
    async writeBundle() {
      if (config.vitePluginSsr.disableAutoBuild) {
        return
      }

      const { configFile, root } = config
      const isSSR = isSSR_config(config)

      if (!isSSR) {
        const configSSR = {
          build: { ssr: true },
          configFile,
          root,
          [triggedByAutoBuild as any]: true,
        }
        await build(configSSR)
      }

      if (
        isSSR &&
        isTriggedByAutoBuild(config) &&
        config.vitePluginSsr.prerender &&
        !config.vitePluginSsr.prerender.disableAutoRun
      ) {
        await prerender({ viteConfig: { configFile, root } })
      }
    },
  }
}

function abortSSRBuild(config: Config) {
  if (config.vitePluginSsr.disableAutoBuild) {
    return
  }
  // CLI
  if (isViteCliCall({ command: 'build', ssr: true })) {
    abortCLI()
    assert(false)
  }
  // API
  if (isSSR_config(config) && !isTriggedByAutoBuild(config)) {
    abortAPI()
    assert(false)
  }
}

function isTriggedByAutoBuild(config: Record<string, unknown>) {
  return !!config[triggedByAutoBuild]
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
