import { runPrerenderFromAutoRun } from '../../prerender/runPrerender.js'

export { buildApp }

import type { InlineConfig, Plugin, ResolvedConfig } from 'vite'
import { isPrerenderAutoRunEnabled } from '../../prerender/context.js'
import { resolveOutDir } from '../shared/getOutDirs.js'
import { getViteConfigFromCli, isViteCliCall } from '../shared/isViteCliCall.js'
import { assert } from '../utils.js'
import { getVikeConfig } from './importUserCode/v1-design/getVikeConfig.js'

function buildApp(): Plugin[] {
  let config: ResolvedConfig

  return [
    {
      name: 'vike:buildApp',
      apply: 'build',
      config(config) {
        if (!config.vike!.global.config.viteEnvironmentAPI) return

        console.log('SHOULD buildApp')

        return {
          appType: 'custom',
          builder: {
            buildApp: async (builder) => {
              assert(builder.environments.client)
              assert(builder.environments.ssr)
              console.log('BUILDING CLIENT')
              await builder.build(builder.environments.client)
              console.log('BUILDING SSR')
              await builder.build(builder.environments.ssr)
            }
          },
          environments: {
            ssr: {
              consumer: 'server',
              build: {
                outDir: resolveOutDir(config, true) || 'dist/server',
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
        return env.name === 'ssr'
      },
      configResolved(_config) {
        config = _config
      },
      async writeBundle() {
        const vikeConfig = await getVikeConfig(config)
        if (!isPrerenderAutoRunEnabled(vikeConfig)) return

        console.log('PRERENDERING')

        const configFromCli = !isViteCliCall() ? null : getViteConfigFromCli()
        let configInline: InlineConfig
        if (config._viteConfigEnhanced) {
          configInline = config._viteConfigEnhanced
        } else {
          configInline = {
            ...configFromCli,
            configFile: configFromCli?.configFile || config.configFile,
            root: config.root,
            build: {
              ...configFromCli?.build
            }
          }
        }

        const { prerenderContextPublic } = await runPrerenderFromAutoRun(configInline)
        config.vike!.prerenderContext = prerenderContextPublic
      }
    }
  ]
}
