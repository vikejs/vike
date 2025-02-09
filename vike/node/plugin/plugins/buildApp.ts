import { runPrerenderFromAutoRun } from '../../prerender/runPrerender.js'

export { buildApp }

import type { InlineConfig, Plugin, ResolvedConfig } from 'vite'
import { isPrerenderAutoRunEnabled } from '../../prerender/context.js'
import { resolveOutDir } from '../shared/getOutDirs.js'
import { getViteConfigFromCli, isViteCliCall } from '../shared/isViteCliCall.js'
import { assert } from '../utils.js'
import { getVikeConfig } from './importUserCode/v1-design/getVikeConfig.js'
import { isVikeCli } from '../../cli/context.js'
import { getFullBuildInlineConfig } from '../shared/getFullBuildInlineConfig.js'

function buildApp(): Plugin[] {
  let config: ResolvedConfig

  return [
    {
      name: 'vike:buildApp',
      apply: 'build',
      config(config) {
        if (!config.vike!.config.viteEnvironmentAPI) return

        return {
          builder: {
            buildApp: async (builder) => {
              assert(builder.environments.client)
              assert(builder.environments.ssr)
              await builder.build(builder.environments.client)
              await builder.build(builder.environments.ssr)
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
      enforce: 'pre',
      applyToEnvironment(env) {
        console.log('applyToEnvironment()')
        return env.name === 'ssr'
      },
      configResolved(_config) {
        console.log('configResolved()')
        config = _config
      },
      async writeBundle() {
        console.log('writeBundle()')
        if (!config.vike!.config.viteEnvironmentAPI) return

        const vikeConfig = await getVikeConfig(config)
        if (!isPrerenderAutoRunEnabled(vikeConfig)) return

        const configInline = getFullBuildInlineConfig(config)

        const { prerenderContextPublic } = await runPrerenderFromAutoRun(configInline)
        config.vike!.prerenderContext = prerenderContextPublic

        if (isVikeCli() || isViteCliCall()) {
          process.exit(0)
        }
      }
    }
  ]
}
