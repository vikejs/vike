export { pluginAutoFullBuild }
export { isPrerenderForceExit }

import { build } from 'vite'
import type { Environment, InlineConfig, Plugin, ResolvedConfig } from 'vite'
import { assert, assertIsSingleModuleInstance, assertWarning, onSetupBuild } from '../../utils.js'
import { isPrerenderAutoRunEnabled, wasPrerenderRun } from '../../../prerender/context.js'
import type { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { isViteCliCall, getViteConfigFromCli } from '../../shared/isViteCliCall.js'
import pc from '@brillout/picocolors'
import { logErrorHint } from '../../../runtime/renderPage/logErrorHint.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { isVikeCliOrApi } from '../../../api/context.js'
import { handleAssetsManifest, handleAssetsManifest_assertUsageCssTarget } from './handleAssetsManifest.js'
import { isViteClientBuild, isViteServerBuild_onlySsrEnv } from '../../shared/isViteServerBuild.js'
import { runPrerender_forceExit, runPrerenderFromAutoRun } from '../../../prerender/runPrerenderEntry.js'
import { getManifestFilePathRelative } from '../../shared/getManifestFilePathRelative.js'
assertIsSingleModuleInstance('build/pluginAutoFullBuild.ts')
let forceExit = false

function pluginAutoFullBuild(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vike:build:pluginAutoFullBuild',
      apply: 'build',
      enforce: 'pre',
      async configResolved(config_) {
        config = config_
        await abortViteBuildSsr()
      },
      writeBundle: {
        /* We can't use this because it breaks Vite's logging. TO-DO/eventually: try again with latest Vite version.
        sequential: true,
        order: 'pre',
        */
        async handler(options, bundle) {
          try {
            await handleAssetsManifest(config, this.environment, options, bundle)
            await triggerFullBuild(config, this.environment, bundle)
          } catch (err) {
            // We use try-catch also because:
            // - Vite/Rollup swallows errors thrown inside the writeBundle() hook. (It doesn't swallow errors thrown inside the first writeBundle() hook while building the client-side, but it does swallow errors thrown inside the second writeBundle() while building the server-side triggered after Vike calls Vite's `build()` API.)
            // - Avoid Rollup prefixing the error with [vike:build:pluginAutoFullBuild], see for example https://github.com/vikejs/vike/issues/472#issuecomment-1276274203
            console.error(err)
            logErrorHint(err)
            process.exit(1)
          }
        },
      },
    },
    {
      name: 'vike:build:pluginAutoFullBuild:post',
      apply: 'build',
      enforce: 'post',
      closeBundle: {
        sequential: true,
        order: 'post',
        async handler() {
          onSetupBuild()
          handleAssetsManifest_assertUsageCssTarget(config)
          const vikeConfig = await getVikeConfigInternal()
          if (
            forceExit &&
            // Let vike:build:pluginBuildApp force exit
            !vikeConfig.config.vite6BuilderApp
          ) {
            runPrerender_forceExit()
            assert(false)
          }
        },
      },
    },
  ]
}

async function triggerFullBuild(config: ResolvedConfig, viteEnv: Environment, bundle: Record<string, unknown>) {
  const vikeConfig = await getVikeConfigInternal()
  // Whether builder.buildApp() is being used, see plugin:build:pluginBuildApp
  const isBuilderApp = vikeConfig.config.vite6BuilderApp
  // If builder.buildApp() => trigger at end of `this.environment.name === 'ssr'`.
  // Else => trigger at end of client-side build.
  if (isBuilderApp ? !isViteServerBuild_onlySsrEnv(config, viteEnv) : !isViteClientBuild(config, viteEnv)) return
  if (isEntirelyDisabled(vikeConfig)) return
  // Workaround for @vitejs/plugin-legacy
  //  - The legacy plugin triggers its own Rollup build for the client-side.
  //  - The legacy plugin doesn't generate a manifest => we can use that to detect the legacy plugin build.
  //  - Issue & reproduction: https://github.com/vikejs/vike/issues/1154#issuecomment-1965954636
  if (!bundle[getManifestFilePathRelative(config.build.manifest)]) return

  const configInline = getFullBuildInlineConfig(config)

  if (!isBuilderApp) {
    await build(setSSR(configInline))
  } else {
    // The server build is already called by builder.buildApp()
  }

  if (isPrerenderAutoRunEnabled(vikeConfig)) {
    const res = await runPrerenderFromAutoRun(configInline)
    forceExit = res.forceExit
    assert(wasPrerenderRun())
  }
}

function setSSR(configInline: InlineConfig): InlineConfig {
  return {
    ...configInline,
    build: {
      ...configInline.build,
      ssr: true,
    },
  }
}

async function abortViteBuildSsr() {
  const vikeConfig = await getVikeConfigInternal()
  if (vikeConfig.config.disableAutoFullBuild !== true && isViteCliCall() && getViteConfigFromCli()?.build.ssr) {
    assertWarning(
      false,
      `The CLI call ${pc.cyan('$ vite build --ssr')} is superfluous since ${pc.cyan(
        '$ vite build',
      )} also builds the server-side. If you want two separate build steps then use https://vike.dev/disableAutoFullBuild or use Vite's ${pc.cyan(
        'build()',
      )} API.`,
      { onlyOnce: true },
    )
    process.exit(0)
  }
}

function isEntirelyDisabled(vikeConfig: VikeConfigInternal): boolean {
  const { disableAutoFullBuild } = vikeConfig.config
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
  if (config._viteConfigFromUserEnhanced) {
    return config._viteConfigFromUserEnhanced
  } else {
    return {
      ...configFromCli,
      configFile: configFromCli?.configFile || config.configFile,
      root: config.root,
      build: {
        ...configFromCli?.build,
      },
    }
  }
}
