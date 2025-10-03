export { pluginViteConfigVikeExtensions }

import type { InlineConfig, Plugin } from 'vite'
import { mergeConfig } from 'vite'
import { assertUsage, isObject } from '../utils.js'
import { getVikeConfigInternalEarly } from '../../api/resolveViteConfigFromUser.js'

async function pluginViteConfigVikeExtensions(): Promise<Plugin[]> {
  let viteConfig: InlineConfig = {}
  const vikeConfig = await getVikeConfigInternalEarly()
  if (vikeConfig === null) return []
  const viteConfigFromExtensions = vikeConfig._from.configsCumulative.vite
  if (!viteConfigFromExtensions) return []
  viteConfigFromExtensions.values.forEach((v) => {
    assertUsage(isObject(v.value), `${v.definedAt} should be an object`)
    viteConfig = mergeConfig(viteConfig, v.value)
  })
  const plugins: Plugin[] = (viteConfig.plugins ?? []) as Plugin[]
  delete viteConfig.plugins
  return [
    ...plugins,
    {
      name: 'vike:pluginViteConfigVikeExtensions',
      config: {
        handler(_config) {
          return viteConfig
        },
      },
    },
  ]
}
