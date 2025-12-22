export { pluginStaticReplace }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, assertUsage, createDebug } from '../utils.js'
import { isViteServerSide_extraSafe } from '../shared/isViteServerSide.js'
import { VikeConfigInternal } from '../shared/resolveVikeConfigInternal.js'
import { applyStaticReplace, type StaticReplace } from './pluginStaticReplace/applyStaticReplace.js'

const debug = createDebug('vike:staticReplace')

function pluginStaticReplace(vikeConfig: VikeConfigInternal): Plugin[] {
  let config: ResolvedConfig

  // staticReplaceList
  const staticReplaceList = getStaticReplaceList(vikeConfig)
  if (staticReplaceList.length === 0) return []

  // === Rolldown filter
  const skipNodeModules = '/node_modules/'
  const include = getFilterRolldown(staticReplaceList)
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
    if (!include.some((s) => code.includes(s))) return false
    return true
  }
  // ===

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
          debug('id', id)
          const env = isViteServerSide_extraSafe(config, this.environment, options) ? 'server' : 'client'
          debug('env', env)
          const result = await applyStaticReplace(code, staticReplaceList, id, env)
          if (debug.isActivated) {
            if (result === undefined) {
              debug('Skipped')
            }
            if (result === null) {
              debug('AST parsed, but no modifications')
            }
            if (result) {
              debug('Before:', code)
              debug('After:', result.code)
            }
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

function getFilterRolldown(staticReplaceList: StaticReplace[]): string[] {
  return staticReplaceList.map((staticReplace) => {
    const { filter } = staticReplace
    assertUsage(filter, '+staticReplace entry is missing rolldown filter')
    return filter
  })
}
