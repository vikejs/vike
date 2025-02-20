import { runPrerender_forceExit, runPrerenderFromAutoRun } from '../../prerender/runPrerender.js'

export { buildApp }

import type { Plugin, ResolvedConfig } from 'vite'
import { isPrerenderAutoRunEnabled } from '../../prerender/context.js'
import { resolveOutDir } from '../shared/getOutDirs.js'
import { assert } from '../utils.js'
import { getVikeConfig } from './importUserCode/v1-design/getVikeConfig.js'
import { getFullBuildInlineConfig } from '../shared/getFullBuildInlineConfig.js'
import { getVikeConfigPublic } from './commonConfig.js'

function buildApp(): Plugin[] {
  let config: ResolvedConfig
  // `builder.buildApp` can be overriden by another plugin e.g vike-vercel https://github.com/vikejs/vike/pull/2184#issuecomment-2659425195
  // In that case, we should'nt `forceExit`.
  let forceExit = false

  return [
    {
      name: 'vike:buildApp',
      apply: 'build',
      config(config) {
        const vike = getVikeConfigPublic(config)
        if (!vike.config.viteEnvironmentAPI) return

        return {
          builder: {
            buildApp: async (builder) => {
              assert(builder.environments.client)
              assert(builder.environments.ssr)
              await builder.build(builder.environments.client)
              await builder.build(builder.environments.ssr)

              if (forceExit) {
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
    },
    {
      name: 'vike:buildApp:prerender',
      apply: 'build',
      applyToEnvironment(env) {
        return env.name === 'ssr'
      },
      configResolved(_config) {
        config = _config
      },
      async writeBundle() {
        const vike = getVikeConfigPublic(config)
        if (!vike.config.viteEnvironmentAPI) return

        const vikeConfig = await getVikeConfig(config)
        if (!isPrerenderAutoRunEnabled(vikeConfig)) return

        const configInline = getFullBuildInlineConfig(config)

        const res = await runPrerenderFromAutoRun(configInline, config)
        forceExit = res.forceExit
      }
    }
  ]
}
