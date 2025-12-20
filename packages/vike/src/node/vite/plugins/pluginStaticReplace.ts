export { pluginStaticReplace }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert } from '../utils.js'
import { isViteServerSide_extraSafe } from '../shared/isViteServerSide.js'
import { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { applyStaticReplace, type StaticReplace } from './pluginStaticReplace/applyStaticReplace.js'
import { buildFilterRolldown } from './pluginStaticReplace/buildFilterRolldown.js'

function pluginStaticReplace(vikeConfig: VikeConfigInternal): Plugin[] {
  let config: ResolvedConfig
  const staticReplaceList = getStaticReplaceList(vikeConfig)
  if (staticReplaceList.length === 0) return []
  const filterRolldown = buildFilterRolldown(staticReplaceList)
  assert(filterRolldown)
  return [
    {
      name: 'vike:pluginStaticReplace',
      enforce: 'post',
      configResolved: {
        async handler(config_) {
          config = config_
        },
      },
      transform: {
        filter: {
          code: {
            include: filterRolldown.code.include,
            exclude: /node_modules/,
          },
        },
        async handler(code, id, options) {
          const env = isViteServerSide_extraSafe(config, this.environment, options) ? 'server' : 'client'
          const result = await applyStaticReplace({
            code,
            id,
            env,
            options: staticReplaceList,
          })
          return result
        },
      },
    },
  ]
}

/**
 * Extract all staticReplaceList from vikeConfig
 */
function getStaticReplaceList(vikeConfig: VikeConfigInternal): StaticReplace[] {
  const staticReplaceConfigs = vikeConfig._from.configsCumulative.staticReplace
  if (!staticReplaceConfigs) return []

  const staticReplaceList: StaticReplace[] = []

  for (const configValue of staticReplaceConfigs.values) {
    const options = configValue.value as StaticReplace[]
    assert(Array.isArray(options))
    staticReplaceList.push(...options)
  }

  return staticReplaceList
}
