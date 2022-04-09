export { chainBuildSteps }

import { build, Plugin, ResolvedConfig } from 'vite'
import { assert, assertWarning, toPosixPath } from '../utils'
import { prerender } from '../../prerender'
import { assertViteConfig } from './config/assertConfig'

function chainBuildSteps(): Plugin {
  skip()
  let config: ResolvedConfig
  return {
    name: 'vite-plugin-ssr:buildConfig',
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
        await build({ build: { ssr: true }, configFile, root })
      } else {
        if (config.vitePluginSsr.prerender) {
          assert(configFile)
          await prerender({ configFile, root })
        }
      }
    },
  }
}

function skip() {
  const { argv } = process
  const isViteCli = argv.includes('build') && argv.some((a) => toPosixPath(a).endsWith('/bin/vite.js'))
  if (isViteCli && argv.includes('--ssr')) {
    assertWarning(
      false,
      'The `$ vite build --ssr` CLI call is deprecated; it is now superfluous and has no effect (`$ vite build` now also builds the server-side code). Drop `$ vite build --ssr` to remove this warning. ',
      { onlyOnce: true },
    )
    process.exit(0)
  }
}
