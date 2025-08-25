export { pluginBuildApp }
export { isPrerenderForceExit }

import { runPrerender_forceExit } from '../../../prerender/runPrerenderEntry.js'
import type { Environment, InlineConfig, Plugin, ResolvedConfig } from 'vite'
import { resolveOutDir } from '../../shared/getOutDirs.js'
import { assert, assertWarning, getGlobalObject, onSetupBuild } from '../../utils.js'
import { isPrerenderAutoRunEnabled, wasPrerenderRun } from '../../../prerender/context.js'
import type { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { isViteCliCall, getViteConfigFromCli } from '../../shared/isViteCliCall.js'
import pc from '@brillout/picocolors'
import { logErrorHint } from '../../../runtime/renderPage/logErrorHint.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { isVikeCliOrApi } from '../../../api/context.js'
import { handleAssetsManifest, handleAssetsManifest_assertUsageCssTarget } from './handleAssetsManifest.js'
import { isViteServerSide_onlySsrEnv } from '../../shared/isViteServerSide.js'
import { runPrerenderFromAutoRun } from '../../../prerender/runPrerenderEntry.js'
import { getManifestFilePathRelative } from '../../shared/getManifestFilePathRelative.js'

const globalObject = getGlobalObject('build/pluginBuildApp.ts', {
  forceExit: false,
})

function pluginBuildApp(): Plugin[] {
  let config: ResolvedConfig
  return [
    {
      name: 'vike:build:pluginBuildApp:pre',
      apply: 'build',
      enforce: 'pre',
      config: {
        order: 'pre',
        handler(_config) {
          return {
            builder: {
              // Can be overridden by another plugin e.g vike-vercel https://github.com/vikejs/vike/pull/2184#issuecomment-2659425195
              async buildApp(builder) {
                assert(builder.environments.client)
                assert(builder.environments.ssr)
                await builder.build(builder.environments.client)
                await builder.build(builder.environments.ssr)

                if (isPrerenderForceExit()) {
                  runPrerender_forceExit()
                  assert(false)
                }
              },
            },
          }
        },
      },
    },
    {
      name: 'vike:build:pluginBuildApp',
      apply: 'build',
      config(config) {
        return {
          environments: {
            ssr: {
              consumer: 'server',
              build: {
                outDir: resolveOutDir(config, true),
                ssr: true,
              },
            },
            client: {
              consumer: 'client',
              build: {
                outDir: resolveOutDir(config, false),
                copyPublicDir: true,
                ssr: false,
              },
            },
          },
        }
      },
    },
    // Moved from pluginAutoFullBuild.ts
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
            await triggerPrerendering(config, this.environment, bundle)
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
        handler() {
          onSetupBuild()
          handleAssetsManifest_assertUsageCssTarget(config, this.environment)
          /* Let vike:build:pluginBuildApp force exit
          runPrerender_forceExit()
          */
        },
      },
    },
  ]
}

async function triggerPrerendering(config: ResolvedConfig, viteEnv: Environment, bundle: Record<string, unknown>) {
  const vikeConfig = await getVikeConfigInternal()
  if (!isViteServerSide_onlySsrEnv(config, viteEnv)) return
  if (isDisabled(vikeConfig)) return
  // Workaround for @vitejs/plugin-legacy
  //  - The legacy plugin triggers its own Rollup build for the client-side.
  //  - The legacy plugin doesn't generate a manifest => we can use that to detect the legacy plugin build.
  //  - Issue & reproduction: https://github.com/vikejs/vike/issues/1154#issuecomment-1965954636
  if (!bundle[getManifestFilePathRelative(config.build.manifest)]) return

  const configInline = getFullBuildInlineConfig(config)

  if (isPrerenderAutoRunEnabled(vikeConfig)) {
    const res = await runPrerenderFromAutoRun(configInline)
    globalObject.forceExit = res.forceExit
    assert(wasPrerenderRun())
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

function isDisabled(vikeConfig: VikeConfigInternal): boolean {
  const { disableAutoFullBuild } = vikeConfig.config
  if (disableAutoFullBuild === undefined || disableAutoFullBuild === 'prerender') {
    const isUserUsingViteApi = !isViteCliCall() && !isVikeCliOrApi()
    return isUserUsingViteApi
  } else {
    return disableAutoFullBuild
  }
}

function isPrerenderForceExit(): boolean {
  return globalObject.forceExit
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
