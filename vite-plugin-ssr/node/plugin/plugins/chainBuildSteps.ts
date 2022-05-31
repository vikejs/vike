export { chainBuildSteps }

import { build, Plugin, ResolvedConfig } from 'vite'
import { assert, assertWarning, isSSR_config, isViteCliCall } from '../utils'
import { prerender } from '../../prerender'
import { assertViteConfig } from './config/assertConfig'
import type { ConfigVps } from './config/VpsConfig'

const triggedByChain = '__triggedByChain'

function chainBuildSteps(): Plugin {
  let config: ResolvedConfig & ConfigVps
  return {
    name: 'vite-plugin-ssr:chainBuildSteps',
    apply: 'build',
    configResolved(config_) {
      assertViteConfig(config_)
      config = config_
      abortSSRBuild(config)
    },
    async writeBundle() {
      if (config.vitePluginSsr.disableBuildChaining) {
        return
      }

      const { configFile, root } = config
      const isSSR = isSSR_config(config)

      if (!isSSR) {
        const configSSR = {
          build: { ssr: true },
          configFile,
          root,
          [triggedByChain as any]: true,
        }
        await build(configSSR)
      }

      if (isSSR && isTriggedByChain(config) && config.vitePluginSsr.prerender) {
        await prerender({ configFile, root })
      }
    },
  }
}

function abortSSRBuild(config: ResolvedConfig & ConfigVps) {
  if (config.vitePluginSsr.disableBuildChaining) {
    return
  }
  // CLI
  if (isViteCliCall({ command: 'build', ssr: true })) {
    abortCLI()
    assert(false)
  }
  // API
  if (isSSR_config(config) && !isTriggedByChain(config)) {
    abortAPI()
    assert(false)
  }
}

function isTriggedByChain(config: Record<string, unknown>) {
  return !!config[triggedByChain]
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
