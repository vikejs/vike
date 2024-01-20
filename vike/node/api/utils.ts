export type { InlineCliConfig }
export { resolveConfig }
export { isCliCall, setCliCall }

import type { InlineConfig } from 'vite'
import type { ConfigVikeResolved, ConfigVikeUserProvided } from '../../shared/ConfigVike.js'

type InlineCliConfig = ConfigVikeUserProvided & { vite?: InlineConfig }

async function resolveConfig(config: InlineCliConfig, command: 'build' | 'serve' | 'preview') {
  const { default: pc } = await import('@brillout/picocolors')
  const { resolveConfig: resolveViteConfig, mergeConfig } = await import('vite')
  const { vite: viteConfig = {}, ...vikeConfig } = config
  let nodeEnv = 'development'
  if (['build', 'preview'].includes(command)) {
    nodeEnv = 'production'
  }

  const viteConfigResolved = await resolveViteConfig(
    viteConfig,
    command === 'preview' ? 'serve' : command,
    'custom',
    nodeEnv,
    command === 'preview'
  ).catch((error) => {
    console.error(pc.red(`error resolving config:\n${error.stack}`), {
      error
    })
    process.exit(1)
  })

  // Add vike to plugins if not present
  if (!viteConfigResolved.plugins.some((p) => p.name === 'vike:resolveVikeConfig')) {
    const { plugin } = await import('../plugin/index.js')

    config.vite ??= {}
    config.vite.plugins ??= []
    config.vite.plugins.push(plugin(vikeConfig))

    return resolveConfig(config, command)
  }

  const { getConfigVike } = await import('../shared/getConfigVike.js')
  const vikeConfigResolved = await getConfigVike(viteConfigResolved)
  // merge the inline config from the cli/api with the config resolved by vike
  // for example:
  // vike.config.js -> prerender:false
  // --config={prerender:true}
  // merged - {prerender:true}
  const mergedConfig = mergeConfig(vikeConfigResolved, config) as ConfigVikeResolved & {
    vite?: InlineConfig
  }
  const { vite: viteConfigMerged, ...mergedVikeConfigResolved } = mergedConfig

  return {
    viteConfig,
    vikeConfigResolved: mergedVikeConfigResolved,
    viteConfigResolved
  }
}

let isCliCall = false
function setCliCall() {
  isCliCall = true
}
