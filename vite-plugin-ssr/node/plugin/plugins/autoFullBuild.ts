export { autoFullBuild }

import { build } from 'vite'
import type { InlineConfig, Plugin, ResolvedConfig } from 'vite'
import { assertWarning } from '../utils.js'
import { prerenderFromAutoFullBuild, prerenderForceExit } from '../../prerender/runPrerender.js'
import { getConfigVps } from '../../shared/getConfigVps.js'
import type { ConfigVpsResolved } from '../../../shared/ConfigVps.js'
import { isViteCliCall, getViteConfigFromCli } from '../shared/isViteCliCall.js'

let forceExit = false

function autoFullBuild(): Plugin[] {
  let config: ResolvedConfig
  let configVps: ConfigVpsResolved
  return [
    {
      name: 'vite-plugin-ssr:autoFullBuild',
      apply: 'build',
      enforce: 'pre',
      async configResolved(config_) {
        configVps = await getConfigVps(config_)
        config = config_
        abortViteBuildSsr(configVps)
      },
      writeBundle: {
        /* We can't use this because it breaks Vite's logging. TODO: try again with latest Vite version.
        sequential: true,
        order: 'pre',
        */
        async handler(_options, bundle) {
          try {
            await triggerFullBuild(config, configVps, bundle)
          } catch (err) {
            // Avoid Rollup prefixing the error with `[vite-plugin-ssr:autoFullBuild]`, for example see https://github.com/brillout/vite-plugin-ssr/issues/472#issuecomment-1276274203
            console.error(err)
            process.exit(1)
          }
        }
      }
    },
    {
      name: 'vite-plugin-ssr:autoFullBuild:forceExit',
      apply: 'build',
      enforce: 'post',
      closeBundle: {
        sequential: true,
        order: 'post',
        handler() {
          if (forceExit) {
            prerenderForceExit()
          }
        }
      }
    }
  ]
}

async function triggerFullBuild(config: ResolvedConfig, configVps: ConfigVpsResolved, bundle: Record<string, unknown>) {
  if (config.build.ssr) return // already triggered
  if (isDisabled(configVps)) return
  // `vite-plugin-ssr.json` missing => it isn't a `$ vite build` call (e.g. @vitejs/plugin-legacy calls Vite's `build()`) => skip
  if (!bundle['vite-plugin-ssr.json']) return

  const configFromCli = !isViteCliCall() ? null : getViteConfigFromCli()
  const configInline = {
    ...configFromCli,
    configFile: configFromCli?.configFile || config.configFile,
    root: config.root,
    build: {
      ...configFromCli?.build
    }
  } satisfies InlineConfig

  await build({
    ...configInline,
    build: {
      ...configInline.build,
      ssr: true
    }
  })

  if (configVps.prerender && !configVps.prerender.disableAutoRun) {
    await prerenderFromAutoFullBuild({ viteConfig: configInline })
    forceExit = true
  }
}

function abortViteBuildSsr(configVps: ConfigVpsResolved) {
  if (!configVps.disableAutoFullBuild && isViteCliCall() && getViteConfigFromCli()?.build.ssr) {
    assertWarning(
      false,
      "The CLI call `$ vite build --ssr` is superfluous since `$ vite build` also builds the server-side. If you want two separate build steps then use https://vite-plugin-ssr.com/disableAutoFullBuild or use Vite's `build()` API.",
      { onlyOnce: true }
    )
    process.exit(0)
  }
}

function isDisabled(configVps: ConfigVpsResolved): boolean {
  if (configVps.disableAutoFullBuild === null) {
    // TODO/v1-release: also enable autoFullBuild when running Vite's build() API
    return !isViteCliCall()
  } else {
    return configVps.disableAutoFullBuild
  }
}
