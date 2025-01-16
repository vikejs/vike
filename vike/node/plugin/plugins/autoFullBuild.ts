// TODO/v1-release: remove this file

export { autoFullBuild }

import { build } from 'vite'
import type { InlineConfig, Plugin, ResolvedConfig } from 'vite'
import { assertWarning } from '../utils.js'
import { runPrerenderFromAutoRun, runPrerender_forceExit } from '../../prerender/runPrerender.js'
import type { VikeConfigGlobal } from './importUserCode/v1-design/getVikeConfig/resolveVikeConfigGlobal.js'
import { isViteCliCall, getViteConfigFromCli } from '../shared/isViteCliCall.js'
import pc from '@brillout/picocolors'
import { logErrorHint } from '../../runtime/renderPage/logErrorHint.js'
import { manifestTempFile } from './buildConfig.js'
import { getVikeConfig } from './importUserCode/v1-design/getVikeConfig.js'

let forceExit = false

function autoFullBuild(): Plugin[] {
  let config: ResolvedConfig
  let configVike: VikeConfigGlobal
  return [
    {
      name: 'vike:autoFullBuild',
      apply: 'build',
      enforce: 'pre',
      async configResolved(config_) {
        const vikeConfig = await getVikeConfig(config_)
        configVike = vikeConfig.vikeConfigGlobal
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
            runPrerender_forceExit()
          }
        }
      }
    }
  ]
}

async function triggerFullBuild(config: ResolvedConfig, configVike: VikeConfigGlobal, bundle: Record<string, unknown>) {
  if (config.build.ssr) return // already triggered
  if (isDisabled(configVike)) return
  // Workaround for @vitejs/plugin-legacy
  //  - The legacy plugin triggers its own Rollup build for the client-side.
  //  - The legacy plugin doesn't generate a manifest => we can use that to detect the legacy plugin build.
  //  - Issue & reproduction: https://github.com/vikejs/vike/issues/1154#issuecomment-1965954636
  if (!bundle[manifestTempFile]) return

  const configFromCli = !isViteCliCall() ? null : getViteConfigFromCli()
  const configInline = {
    ...configFromCli,
    configFile: configFromCli?.configFile || config.configFile,
    root: config.root,
    build: {
      ...configFromCli?.build
    }
  } satisfies InlineConfig

  try {
    await build({
      ...configInline,
      build: {
        ...configInline.build,
        ssr: true
      }
    })
  } catch (err) {
    console.error(err)
    logErrorHint(err)
    process.exit(1)
  }

  if (configVike.prerender && !configVike.prerender.disableAutoRun && configVike.disableAutoFullBuild !== 'prerender') {
    await runPrerenderFromAutoRun(configInline, false)
    forceExit = true
  }
}

function abortViteBuildSsr(configVike: VikeConfigGlobal) {
  if (configVike.disableAutoFullBuild !== true && isViteCliCall() && getViteConfigFromCli()?.build.ssr) {
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

function isDisabled(configVike: VikeConfigGlobal): boolean {
  const { disableAutoFullBuild } = configVike
  if (disableAutoFullBuild === null || disableAutoFullBuild === 'prerender') {
    return !isViteCliCall()
  } else {
    return disableAutoFullBuild
  }
}
