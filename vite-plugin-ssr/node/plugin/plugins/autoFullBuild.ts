export { autoFullBuild }

import { build, Plugin, ResolvedConfig } from 'vite'
import { assertWarning } from '../utils'
import { getConfigFromCli, isViteCliCall } from '../helpers'
import { prerender } from '../../prerender'
import { assertConfigVpsResolved } from './config/assertConfigVps'
import type { ConfigVpsResolved } from './config/ConfigVps'

type Config = ResolvedConfig & { vitePluginSsr: ConfigVpsResolved }

function autoFullBuild(): Plugin {
  let config: Config
  return {
    name: 'vite-plugin-ssr:autoFullBuild',
    apply: 'build',
    enforce: 'pre',
    configResolved(config_) {
      assertConfigVpsResolved(config_)
      config = config_
      abortSSRBuild(config)
    },
    // TODO: use `sequential: true` once available
    async writeBundle() {
      try {
        await triggerFullBuild(config)
      } catch (err) {
        // Avoid Rollup prefixing the error with `[vite-plugin-ssr:autoFullBuild]`, for example see https://github.com/brillout/vite-plugin-ssr/issues/472#issuecomment-1276274203
        console.error(err)
        process.exit(1)
      }
    }
  }
}

async function triggerFullBuild(config: Config) {
  if (config.build.ssr || config.vitePluginSsr.disableAutoFullBuild || !isViteCliCall()) {
    return
  }

  const configFromCli = getConfigFromCli()
  if (!configFromCli.configFile) {
    configFromCli.configFile = config.configFile
  }
  if (!configFromCli.root) {
    configFromCli.root = config.root
  }

  await build({
    ...configFromCli,
    build: {
      ...configFromCli.build,
      ssr: true
    }
  })

  if (config.vitePluginSsr.prerender && !config.vitePluginSsr.prerender.disableAutoRun) {
    await prerender({ viteConfig: configFromCli })
  }
}

function abortSSRBuild(config: Config) {
  if (!config.vitePluginSsr.disableAutoFullBuild && isViteCliCall({ command: 'build', ssr: true })) {
    assertWarning(
      false,
      "The CLI call `$ vite build --ssr` is superfluous since `$ vite build` also builds the server-side. If you want two separate build steps then use https://vite-plugin-ssr.com/disableAutoFullBuild or use Vite's `build()` API.",
      { onlyOnce: true }
    )
    process.exit(0)
  }
}
