export { chainBuildSteps }

import { build, Plugin, ResolvedConfig } from 'vite'
import { assert, assertWarning, isViteCliCall } from '../utils'
import { prerender } from '../../prerender'
import { assertViteConfig } from './config/assertConfig'

const triggedByChainBuildSteps = '__triggedByChainBuildSteps'

function chainBuildSteps(): Plugin {
  skip1()
  let config: ResolvedConfig
  return {
    name: 'vite-plugin-ssr:chainBuildSteps',
    apply: 'build',
    configResolved(config_) {
      config = config_
    },
    async writeBundle() {
      assertViteConfig(config)
      if (config.vitePluginSsr.disableBuildChaining) {
        return
      }
      const { configFile, root } = config
      if (!config.build?.ssr) {
        await build({ build: { ssr: true }, configFile, root, [triggedByChainBuildSteps as any]: true })
      } else {
        if (!(config as any)[triggedByChainBuildSteps]) {
          skip2()
        }
        if (config.vitePluginSsr.prerender) {
          assert(configFile)
          await prerender({ configFile, root })
        }
      }
    },
  }
}

function skip1() {
  if (isViteCliCall({ command: 'build', ssr: true })) {
    assertWarning(
      false,
      'The `$ vite build --ssr` CLI call is outdated; it is now superfluous and has no effect (`$ vite build` now also builds server-side code). Drop `$ vite build --ssr` to remove this warning.',
      { onlyOnce: true },
    )
    process.exit(0)
  }
}
function skip2() {
  assertWarning(
    false,
    'The `build({ build: { ssr: true } })` call is outdated; it is now superfluous and has no effect (`build()` now also builds server-side code). Drop `build({ build: { ssr: true } })` to remove this warning.',
    { onlyOnce: true },
  )
  process.exit(0)
}
