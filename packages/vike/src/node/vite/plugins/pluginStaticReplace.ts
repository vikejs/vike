export { pluginStaticReplace }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, createDebug } from '../utils.js'
import { isViteServerSide_extraSafe } from '../shared/isViteServerSide.js'
import { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { applyStaticReplace, type StaticReplace } from './pluginStaticReplace/applyStaticReplace.js'
import { buildFilterRolldown } from './pluginStaticReplace/buildFilterRolldown.js'

const debug = createDebug('vike:staticReplace')

function pluginStaticReplace(vikeConfig: VikeConfigInternal): Plugin[] {
  let config: ResolvedConfig

  // staticReplaceList
  const staticReplaceList = getStaticReplaceList(vikeConfig)
  if (staticReplaceList.length === 0) return []

  // filterRolldown
  const skipNodeModules = '/node_modules/'
  const include = buildFilterRolldown(staticReplaceList)
  assert(include)
  const filterRolldown = {
    id: {
      exclude: `**${skipNodeModules}**`,
    },
    code: {
      include,
    },
  }
  const filterFunction = (id: string, code: string) => {
    if (id.includes(skipNodeModules)) return false
    if (!include.test(code)) return false
    return true
  }

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
        filter: filterRolldown,
        async handler(code, id, options) {
          assert(filterFunction(id, code))
          const env = isViteServerSide_extraSafe(config, this.environment, options) ? 'server' : 'client'
          const result = await applyStaticReplace({
            code,
            id,
            env,
            options: staticReplaceList,
          })
          if (debug.isActivated && result) {
            debug('id', id)
            debug('before', code)
            debug('after', result.code)
          }
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
    const entries = configValue.value as StaticReplace[]
    assert(Array.isArray(entries))
    staticReplaceList.push(...entries)
  }

  return staticReplaceList
}
