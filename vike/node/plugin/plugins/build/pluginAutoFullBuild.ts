export { pluginAutoFullBuild }
export { isPrerenderForceExit }

import { build } from 'vite'
import type { Environment, InlineConfig, Plugin, ResolvedConfig } from 'vite'
import { assert, assertIsSingleModuleInstance, assertWarning, onSetupBuild } from '../../utils.js'
import { runPrerenderFromAutoRun, runPrerender_forceExit } from '../../../prerender/runPrerender.js'
import { isPrerenderAutoRunEnabled } from '../../../prerender/context.js'
import type { VikeConfigObject } from '../importUserCode/v1-design/getVikeConfig.js'
import { isViteCliCall, getViteConfigFromCli } from '../../shared/isViteCliCall.js'
import pc from '@brillout/picocolors'
import { logErrorHint } from '../../../runtime/renderPage/logErrorHint.js'
import { manifestTempFile } from './pluginBuildConfig.js'
import { getVikeConfig } from '../importUserCode/v1-design/getVikeConfig.js'
import { isVikeCliOrApi } from '../../../api/context.js'
import { handleAssetsManifest, handleAssetsManifest_assertUsageCssTarget } from './handleAssetsManifest.js'
import { isViteClientBuild, isViteServerBuild_onlySsrEnv } from '../../shared/isViteServerBuild.js'
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
          await triggerFullBuild(config, vikeConfig, this.environment, bundle)
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
          onSetupBuild()
          handleAssetsManifest_assertUsageCssTarget(config)
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

async function triggerFullBuild(
  config: ResolvedConfig,
  vikeConfig: VikeConfigObject,
  viteEnv: Environment,
  bundle: Record<string, unknown>
) {
  // Whether builder.buildApp() is being used, see plugin:build:pluginBuildApp
  const isBuilderApp = vikeConfig.global.config.viteEnvironmentAPI
  // If builder.buildApp() => trigger at end of `this.environment.name === 'ssr'`.
  // Else => trigger at end of client-side build.
  if (isBuilderApp ? !isViteServerBuild_onlySsrEnv(config, viteEnv) : !isViteClientBuild(config, viteEnv)) return
  if (isEntirelyDisabled(vikeConfig)) return
  // Workaround for @vitejs/plugin-legacy
  //  - The legacy plugin triggers its own Rollup build for the client-side.
  //  - The legacy plugin doesn't generate a manifest => we can use that to detect the legacy plugin build.
  //  - Issue & reproduction: https://github.com/vikejs/vike/issues/1154#issuecomment-1965954636
  if (!bundle[manifestTempFile]) return

  const configInline = getFullBuildInlineConfig(config)

  if (!isBuilderApp) {
    try {
      await build(setSSR(configInline))
    } catch (err) {
      // Avoid Rollup prefixing the error with [vike:build:pluginAutoFullBuild], see for example https://github.com/vikejs/vike/issues/472#issuecomment-1276274203
      console.error(err)
      logErrorHint(err)
      process.exit(1)
    }
  } else {
    // The server bulid is already called by builder.buildApp()
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

function getFullBuildInlineConfig(config: ResolvedConfig): InlineConfig {
  const configFromCli = !isViteCliCall() ? null : getViteConfigFromCli()
  if (config._viteConfigEnhanced) {
    return config._viteConfigEnhanced
  } else {
    return {
      ...configFromCli,
      configFile: configFromCli?.configFile || config.configFile,
      root: config.root,
      build: {
        ...configFromCli?.build
      }
    }
  }
}
