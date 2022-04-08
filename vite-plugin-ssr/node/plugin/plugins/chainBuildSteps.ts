export { chainBuildSteps }

import { build, Plugin, ResolvedConfig } from 'vite'
import { assert, assertWarning, toPosixPath } from '../utils'
import { prerender } from '../../prerender'
import { assertVitePluginSsrConfig } from './config/VitePluginSsrConfig'
const { argv } = process
const isViteCli = argv.includes('build') && argv.some((a) => toPosixPath(a).endsWith('/bin/vite.js'))

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
      assertVitePluginSsrConfig(config)
      if (!isViteCli) {
        return
      }
      if (!config.build?.ssr) {
        await build({ build: { ssr: true } })
      } else {
        if (config.vitePluginSsr.prerender) {
          const { configFile } = config
          assert(configFile)
          prerender({ configFile })
        }
      }
    },
  }
}

function skip() {
  if (isViteCli && argv.includes('--ssr')) {
    assertWarning(
      false,
      'The `$ vite build --ssr` CLI call is deprecated; it is now superfluous and has no effect (`$ vite build` now also builds the server-side code). Drop `$ vite build --ssr` to remove this warning. ',
      { onlyOnce: true },
    )
    process.exit(0)
  }
}
