export { pluginBuildApp }

import { runPrerender_forceExit } from '../../../prerender/runPrerender.js'
import type { Plugin } from 'vite'
import { resolveOutDir } from '../../shared/getOutDirs.js'
import { assert } from '../../utils.js'
import { isPrerenderForceExit } from './pluginAutoFullBuild.js'
import { getVikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'

function pluginBuildApp(): Plugin[] {
  return [
    {
      name: 'vike:build:pluginBuildApp',
      apply: 'build',
      async config(config) {
        const vikeConfig = await getVikeConfigInternal()
        if (!vikeConfig.config.vite6BuilderApp) return

        return {
          builder: {
            // Can be overriden by another plugin e.g vike-vercel https://github.com/vikejs/vike/pull/2184#issuecomment-2659425195
            async buildApp(builder) {
              assert(builder.environments.client)
              assert(builder.environments.ssr)
              await builder.build(builder.environments.client)
              await builder.build(builder.environments.ssr)

              if (isPrerenderForceExit()) {
                runPrerender_forceExit()
                assert(false)
              }
            }
          },
          environments: {
            ssr: {
              consumer: 'server',
              build: {
                outDir: resolveOutDir(config, true),
                ssr: true
              }
            },
            client: {
              consumer: 'client',
              build: {
                copyPublicDir: true,
                ssr: false
              }
            }
          }
        }
      }
    }
  ]
}
