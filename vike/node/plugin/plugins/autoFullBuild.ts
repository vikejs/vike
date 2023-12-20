export { autoFullBuild }

import { build } from 'vite'
import type { InlineConfig, Plugin, ResolvedConfig } from 'vite'
import { assertWarning } from '../utils.js'
import { prerenderFromAutoFullBuild, prerenderForceExit } from '../../prerender/runPrerender.js'
import { getConfigVike } from '../../shared/getConfigVike.js'
import type { ConfigVikeResolved } from '../../../shared/ConfigVike.js'
import { isViteCliCall, getViteConfigFromCli } from '../shared/isViteCliCall.js'
import pc from '@brillout/picocolors'

let forceExit = false

function autoFullBuild(): Plugin[] {
  let config: ResolvedConfig
  let configVike: ConfigVikeResolved
  return [
    {
      name: 'vike:autoFullBuild',
      apply: 'build',
      enforce: 'pre',
      async configResolved(config_) {
        configVike = await getConfigVike(config_)
        config = config_
        abortViteBuildSsr(configVike)
      },
      writeBundle: {
        /* We can't use this because it breaks Vite's logging. TODO: try again with latest Vite version.
        sequential: true,
        order: 'pre',
        */
        async handler(_options, bundle) {
          try {
            await triggerFullBuild(config, configVike, bundle)
          } catch (err) {
            // Avoid Rollup prefixing the error with [vike:autoFullBuild], for example see https://github.com/vikejs/vike/issues/472#issuecomment-1276274203
            console.error(err)
            process.exit(1)
          }
        }
      }
    },
    {
      name: 'vike:autoFullBuild:forceExit',
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

async function triggerFullBuild(
  config: ResolvedConfig,
  configVike: ConfigVikeResolved,
  bundle: Record<string, unknown>
) {
  if (config.build.ssr) return // already triggered
  if (isDisabled(configVike)) return
  /* Is this @vitejs/plugin-legacy workaround still needed? Should we re-implement it?
  // vike.json missing => it isn't a `$ vite build` call (e.g. @vitejs/plugin-legacy calls Vite's build() API) => skip
  if (!bundle['vike.json']) return
  */

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

  if (configVike.prerender && !configVike.prerender.disableAutoRun) {
    await prerenderFromAutoFullBuild({ viteConfig: configInline })
    forceExit = true
  }
}

function abortViteBuildSsr(configVike: ConfigVikeResolved) {
  if (!configVike.disableAutoFullBuild && isViteCliCall() && getViteConfigFromCli()?.build.ssr) {
    assertWarning(
      false,
      `The CLI call ${pc.cyan('$ vite build --ssr')} is superfluous since ${pc.cyan(
        '$ vite build'
      )} also builds the server-side. If you want two separate build steps then use https://vike.dev/disableAutoFullBuild or use Vite's ${pc.cyan(
        'build()'
      )} API.`,
      { onlyOnce: true }
    )
    process.exit(0)
  }
}

function isDisabled(configVike: ConfigVikeResolved): boolean {
  if (configVike.disableAutoFullBuild === null) {
    // TODO/v1-release: also enable autoFullBuild when running Vite's build() API
    return !isViteCliCall()
  } else {
    return configVike.disableAutoFullBuild
  }
}
