export { pluginAutoFullBuild }
export { isPrerenderForceExit }

import { getFullBuildInlineConfig } from '../../shared/getFullBuildInlineConfig.js'
import { build } from 'vite'
import type { InlineConfig, Plugin, ResolvedConfig } from 'vite'
import { assert, assertIsSingleModuleInstance, assertWarning } from '../../utils.js'
import { runPrerenderFromAutoRun, runPrerender_forceExit } from '../../../prerender/runPrerender.js'
import { isPrerenderAutoRunEnabled } from '../../../prerender/context.js'
import type { VikeConfigObject } from '../importUserCode/v1-design/getVikeConfig.js'
import { isViteCliCall, getViteConfigFromCli } from '../../shared/isViteCliCall.js'
import pc from '@brillout/picocolors'
import { logErrorHint } from '../../../runtime/renderPage/logErrorHint.js'
import { manifestTempFile } from './pluginBuildConfig.js'
import { getVikeConfig } from '../importUserCode/v1-design/getVikeConfig.js'
import { isVikeCliOrApi } from '../../../api/context.js'
import { handleAssetsManifest } from './handleAssetsManifest.js'
assertIsSingleModuleInstance('build/pluginAutoFullBuild.ts')
let forceExit = false

function pluginAutoFullBuild(): Plugin[] {
  let config: ResolvedConfig
  let vikeConfig: VikeConfigObject
  return [
    {
      name: 'vike:build:pluginAutoFullBuild',
      apply: 'build',
      enforce: 'pre',
      async configResolved(config_) {
        vikeConfig = await getVikeConfig(config_)
        config = config_
        abortViteBuildSsr(vikeConfig)
      },
      writeBundle: {
        /* We can't use this because it breaks Vite's logging. TODO/eventually: try again with latest Vite version.
        sequential: true,
        order: 'pre',
        */
        async handler(options, bundle) {
          await handleAssetsManifest(config, this.environment, options, bundle)
          await triggerFullBuild(config, vikeConfig, bundle)
        }
      }
    },
    {
      name: 'vike:build:pluginAutoFullBuild:forceExit',
      apply: 'build',
      enforce: 'post',
      closeBundle: {
        sequential: true,
        order: 'post',
        handler() {
          if (
            forceExit &&
            // Let vike:build:pluginBuildApp force exit
            !vikeConfig.global.config.viteEnvironmentAPI
          ) {
            runPrerender_forceExit()
            assert(false)
          }
        }
      }
    }
  ]
}

async function triggerFullBuild(config: ResolvedConfig, vikeConfig: VikeConfigObject, bundle: Record<string, unknown>) {
  if (config.build.ssr) return // already triggered
  if (isEntirelyDisabled(vikeConfig)) return
  // Workaround for @vitejs/plugin-legacy
  //  - The legacy plugin triggers its own Rollup build for the client-side.
  //  - The legacy plugin doesn't generate a manifest => we can use that to detect the legacy plugin build.
  //  - Issue & reproduction: https://github.com/vikejs/vike/issues/1154#issuecomment-1965954636
  if (!bundle[manifestTempFile]) return

  const configInline = getFullBuildInlineConfig(config)

  if (!vikeConfig.global.config.viteEnvironmentAPI) {
    try {
      await build(setSSR(configInline))
    } catch (err) {
      // Avoid Rollup prefixing the error with [vike:build:pluginAutoFullBuild], see for example https://github.com/vikejs/vike/issues/472#issuecomment-1276274203
      console.error(err)
      logErrorHint(err)
      process.exit(1)
    }
  } else {
    // Already chained by vike:build:pluginBuildApp
  }

  if (isPrerenderAutoRunEnabled(vikeConfig)) {
    const res = await runPrerenderFromAutoRun(configInline, config)
    forceExit = res.forceExit
  }
}

function setSSR(configInline: InlineConfig): InlineConfig {
  return {
    ...configInline,
    build: {
      ...configInline.build,
      ssr: true
    }
  }
}

function abortViteBuildSsr(vikeConfig: VikeConfigObject) {
  if (vikeConfig.global.config.disableAutoFullBuild !== true && isViteCliCall() && getViteConfigFromCli()?.build.ssr) {
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

function isEntirelyDisabled(vikeConfig: VikeConfigObject): boolean {
  const { disableAutoFullBuild } = vikeConfig.global.config
  if (disableAutoFullBuild === undefined || disableAutoFullBuild === 'prerender') {
    const isUserUsingViteApi = !isViteCliCall() && !isVikeCliOrApi()
    return isUserUsingViteApi
  } else {
    return disableAutoFullBuild
  }
}

function isPrerenderForceExit(): boolean {
  return forceExit
}
