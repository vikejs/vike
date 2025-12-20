export { pluginStaticReplace }

import type { Plugin, ResolvedConfig } from 'vite'
import { assertPosixPath } from '../../utils.js'
import { normalizeId } from '../../shared/normalizeId.js'
import { isViteServerSide_extraSafe } from '../../shared/isViteServerSide.js'
import { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { transformStaticReplace, type TransformStaticReplaceOptions, type ReplaceRule } from '../pluginStaticReplace.js'

function pluginStaticReplace(vikeConfig: VikeConfigInternal): Plugin[] {
  let config: ResolvedConfig
  let rules: ReplaceRule[] | null = null

  return [
    {
      name: 'vike:pluginStaticReplace',
      enforce: 'post',
      configResolved: {
        async handler(config_) {
          config = config_

          const staticReplaceConfigs = vikeConfig._from.configsCumulative.staticReplace
          if (!staticReplaceConfigs) return

          const allRules: ReplaceRule[] = []

          for (const configValue of staticReplaceConfigs.values) {
            const options = configValue.value as TransformStaticReplaceOptions
            if (options?.rules) {
              allRules.push(...options.rules)
            }
          }

          if (allRules.length > 0) {
            rules = allRules
          }
        },
      },
      transform: {
        async handler(code, id, options) {
          if (!rules || rules.length === 0) return null

          id = normalizeId(id)
          assertPosixPath(id)
          assertPosixPath(config.root)
          if (!id.startsWith(config.root)) return null // skip linked dependencies

          const env = isViteServerSide_extraSafe(config, this.environment, options) ? 'server' : 'client'

          const result = await transformStaticReplace({
            code,
            id,
            env,
            options: { rules },
          })

          return result
        },
      },
    },
  ]
}
