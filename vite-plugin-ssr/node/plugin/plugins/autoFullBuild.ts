export { autoFullBuild }

import { build, Plugin, ResolvedConfig } from 'vite'
import { assertWarning } from '../utils'
import { getViteBuildCliConfig, isViteCliCall } from '../helpers'
import { prerender } from '../../prerender'
import { getConfigVps } from './config/assertConfigVps'
import type { ConfigVpsResolved } from './config/ConfigVps'

function autoFullBuild(): Plugin {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
  return {
    name: 'vite-plugin-ssr:autoFullBuild',
    apply: 'build',
    enforce: 'pre',
    async configResolved(config_) {
      configVps = await getConfigVps(config_)
      config = config_
      abortSSRBuild(configVps)
    },
    // TODO: use `sequential: true` once available
    async writeBundle(_options, bundle) {
      try {
        await triggerFullBuild(config, configVps, bundle)
      } catch (err) {
        // Avoid Rollup prefixing the error with `[vite-plugin-ssr:autoFullBuild]`, for example see https://github.com/brillout/vite-plugin-ssr/issues/472#issuecomment-1276274203
        console.error(err)
        process.exit(1)
      }
    }
  }
}

async function triggerFullBuild(config: ResolvedConfig, configVps: ConfigVpsResolved, bundle: Record<string, unknown>) {
  if (
    config.build.ssr ||
    configVps.disableAutoFullBuild ||
    !isViteCliCall() ||
    // `vite-plugin-ssr.json` missing => it isn't a `$ vite build` call (e.g. @vitejs/plugin-legacy calls Vite's `build()`) => skip
    !bundle['vite-plugin-ssr.json']
  ) {
    return
  }

  const configFromCli = getViteBuildCliConfig()
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

  if (configVps.prerender && !configVps.prerender.disableAutoRun) {
    await prerender({ viteConfig: configFromCli })
  }
}

function abortSSRBuild(configVps: ConfigVpsResolved) {
  if (!configVps.disableAutoFullBuild && isViteCliCall() && getViteBuildCliConfig().build.ssr) {
    assertWarning(
      false,
      "The CLI call `$ vite build --ssr` is superfluous since `$ vite build` also builds the server-side. If you want two separate build steps then use https://vite-plugin-ssr.com/disableAutoFullBuild or use Vite's `build()` API.",
      { onlyOnce: true }
    )
    process.exit(0)
  }
}
