export { pluginBuildApp }

import { runPrerender_forceExit } from '../../../prerender/runPrerenderEntry.js'
import type { Environment, InlineConfig, Plugin, ResolvedConfig } from 'vite'
import { resolveOutDir } from '../../shared/getOutDirs.js'
import { assert, assertWarning, escapeRegex, getGlobalObject, onSetupBuild } from '../../utils.js'
import { isPrerenderAutoRunEnabled, wasPrerenderRun } from '../../../prerender/context.js'
import type { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { isViteCli, getViteConfigForBuildFromCli } from '../../shared/isViteCli.js'
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

function pluginVirtualFileEntry(): Plugin[] {
  const moduleContent = `<!-- vike:dummy-html -->`
  const VIRTUAL_FILE_ENTRY_ID = 'virtual:vike:dummy-html'
  const resolvedId = '\0' + VIRTUAL_FILE_ENTRY_ID
  return [
    {
      name: 'telefunc:pluginVirtualFileEntry',
      resolveId: {
        filter: {
          id: new RegExp(`^${escapeRegex(VIRTUAL_FILE_ENTRY_ID)}$`),
        },
        handler(id) {
          assert(id === VIRTUAL_FILE_ENTRY_ID)
          return resolvedId
        },
      },
      load: {
        filter: {
          /* I don't know why this doesn't work:
        id: resolvedId,
        */
          id: new RegExp(`^${escapeRegex(resolvedId)}$`),
        },
        handler(id) {
          return id === resolvedId ? moduleContent : undefined
        },
      },
    },
  ]
}
function pluginVirtualFileEntry2(): Plugin[] {
  const moduleContent = `console.log('vike:dummy-ssr-entry')`
  const VIRTUAL_FILE_ENTRY_ID = 'virtual:vike:dummy-ssr-entry'
  const resolvedId = '\0' + VIRTUAL_FILE_ENTRY_ID
  return [
    {
      name: 'telefunc:pluginVirtualFileEntry',
      resolveId: {
        filter: {
          id: new RegExp(`^${escapeRegex(VIRTUAL_FILE_ENTRY_ID)}$`),
        },
        handler(id) {
          assert(id === VIRTUAL_FILE_ENTRY_ID)
          return resolvedId
        },
      },
      load: {
        filter: {
          /* I don't know why this doesn't work:
        id: resolvedId,
        */
          id: new RegExp(`^${escapeRegex(resolvedId)}$`),
        },
        handler(id) {
          return id === resolvedId ? moduleContent : undefined
        },
      },
    },
  ]
}

function pluginBuildApp(): Plugin[] {
  let config: ResolvedConfig
  return [
    ...pluginVirtualFileEntry(),
    ...pluginVirtualFileEntry2(),
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
              sharedConfigBuild: true,
            },
          }
        },
      },
    },
    {
      name: 'vike:build:pluginBuildApp',
      apply: 'build',
      config: {
        handler(config) {
          return {
            environments: {
              ssr: {
                consumer: 'server',
                build: {
                  outDir: resolveOutDir(config, true),
                  ssr: true,
                  rollupOptions: {
                    input: 'virtual:vike:dummy-ssr-entry',
                  },
                },
              },
              client: {
                consumer: 'client',
                build: {
                  rollupOptions: {
                    input: 'virtual:vike:dummy-html',
                  },
                  outDir: resolveOutDir(config, false),
                  copyPublicDir: true,
                  ssr: false,
                },
              },
            },
          }
        },
      },
    },
    {
      name: 'vike:build:pluginBuildApp:autoFullBuild:pre',
      apply: 'build',
      enforce: 'pre',
      configResolved: {
        async handler(config_) {
          config = config_
          await abortViteBuildSsr()
        },
      },
      // TO-DO/eventually: stop using this writeBundle() hack and, instead, use the buildApp() implementation above.
      // - Could it cause issues if a tool uses the writeBundle() hack together with getVikeConfig() ?
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
            // - Avoid Rollup prefixing the error with [vike:build:pluginBuildApp], see for example https://github.com/vikejs/vike/issues/472#issuecomment-1276274203
            console.error(err)
            logErrorHint(err)
            process.exit(1)
          }
        },
      },
    },
    {
      name: 'vike:build:pluginBuildApp:autoFullBuild:post',
      apply: 'build',
      enforce: 'post',
      closeBundle: {
        sequential: true,
        order: 'post',
        handler() {
          onSetupBuild()
          handleAssetsManifest_assertUsageCssTarget(config, this.environment)
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
  if (!isPrerenderAutoRunEnabled(vikeConfig)) return

  const configInline = getFullBuildInlineConfig(config)
  const res = await runPrerenderFromAutoRun(configInline)
  globalObject.forceExit = res.forceExit
  assert(wasPrerenderRun())
}

async function abortViteBuildSsr() {
  const vikeConfig = await getVikeConfigInternal()
  if (vikeConfig.config.disableAutoFullBuild !== true && isViteCli() && getViteConfigForBuildFromCli()?.build.ssr) {
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
    const isUserUsingViteApi = !isViteCli() && !isVikeCliOrApi()
    return isUserUsingViteApi
  } else {
    return disableAutoFullBuild
  }
}

function isPrerenderForceExit(): boolean {
  return globalObject.forceExit
}

function getFullBuildInlineConfig(config: ResolvedConfig): InlineConfig {
  const configFromCli = !isViteCli() ? null : getViteConfigForBuildFromCli()
  if (config._viteConfigFromUserResolved) {
    return config._viteConfigFromUserResolved
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
