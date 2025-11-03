export { pluginViteConfigVikeExtensions }

import type { InlineConfig, Plugin } from 'vite'
import { mergeConfig } from 'vite'
import { assertUsage, isCallable, isObject } from '../utils.js'
import { getVikeConfigInternalEarly } from '../../api/resolveViteConfigFromUser.js'

// Apply +vite
// - For example, Vike extensions adding Vite plugins
async function pluginViteConfigVikeExtensions(): Promise<Plugin[]> {
  const vikeConfig = await getVikeConfigInternalEarly()
  if (vikeConfig === null) return []
  let viteConfigFromExtensions: InlineConfig = {}
  const viteConfigsExtensions = vikeConfig._from.configsCumulative.vite
  if (!viteConfigsExtensions) return []
  await Promise.all(
    viteConfigsExtensions.values.map(async (v) => {
      let val = v.value
      if (isCallable(val)) val = await val()
      assertUsage(isObject(val), `${v.definedAt} should be an object, or a function returning an object`)
      viteConfigFromExtensions = mergeConfig(viteConfigFromExtensions, val)
    }),
  )
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
