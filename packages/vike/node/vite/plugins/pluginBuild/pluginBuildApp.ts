export { pluginBuildApp }

import { runPrerender_forceExit } from '../../../prerender/runPrerenderEntry.js'
import type { Plugin } from 'vite'
import { resolveOutDir } from '../../shared/getOutDirs.js'
import { assert } from '../../utils.js'
import { isPrerenderForceExit } from './pluginAutoFullBuild.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'

function pluginBuildApp(): Plugin[] {
  return [
    {
      name: 'vike:build:pluginBuildApp:pre',
      apply: 'build',
      enforce: 'pre',
      config: {
        order: 'pre',
        async handler(_config) {
          const vikeConfig = await getVikeConfigInternal()
          if (!vikeConfig.config.vite6BuilderApp) return

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
      async config(config) {
        const vikeConfig = await getVikeConfigInternal()
        if (!vikeConfig.config.vite6BuilderApp) return

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
  ]
}
