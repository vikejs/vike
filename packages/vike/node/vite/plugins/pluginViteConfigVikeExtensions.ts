export { pluginViteConfigVikeExtensions }

import type { InlineConfig, Plugin } from 'vite'
import { mergeConfig } from 'vite'
import { assertUsage, isObject } from '../utils.js'
import { getVikeConfigInternalEarly } from '../../api/resolveViteConfigFromUser.js'

async function pluginViteConfigVikeExtensions(): Promise<Plugin[]> {
  const vikeConfig = await getVikeConfigInternalEarly()
  if (vikeConfig === null) return []
  let viteConfigFromExtensions: InlineConfig = {}
  const viteConfigsExtensions = vikeConfig._from.configsCumulative.vite
  if (!viteConfigsExtensions) return []
  viteConfigsExtensions.values.forEach((v) => {
    assertUsage(isObject(v.value), `${v.definedAt} should be an object`)
    viteConfigFromExtensions = mergeConfig(viteConfigFromExtensions, v.value)
  })
  const pluginsFromExtensions: Plugin[] = (viteConfigFromExtensions.plugins ?? []) as Plugin[]
  delete viteConfigFromExtensions.plugins
  return [
    ...pluginsFromExtensions,
    {
      name: 'vike:pluginViteConfigVikeExtensions',
      config: {
        handler(_config) {
          return viteConfigFromExtensions
        },
      },
    },
  ]
}
