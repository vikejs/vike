export { pluginStaticReplace }
export { buildFilterRolldown }

import type { Plugin, ResolvedConfig } from 'vite'
import { assertPosixPath, escapeRegex } from '../../utils.js'
import { normalizeId } from '../../shared/normalizeId.js'
import { isViteServerSide_extraSafe } from '../../shared/isViteServerSide.js'
import { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { transformStaticReplace, type TransformStaticReplaceOptions, type ReplaceRule } from '../pluginStaticReplace.js'

function pluginStaticReplace(vikeConfig: VikeConfigInternal): Plugin[] {
  let config: ResolvedConfig
  let rules: ReplaceRule[] | null = null
  let filterRolldown: { code: { include: RegExp } } | null = null

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
            filterRolldown = buildFilterRolldown(allRules)
          }
        },
      },
      transform: {
        filter: filterRolldown || undefined,
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

/**
 * Build a filterRolldown from rules by extracting all import strings.
 * For example: import:vike-react/ClientOnly:ClientOnly creates a regex
 * that matches files containing both 'vike-react/ClientOnly' and 'ClientOnly'
 */
function buildFilterRolldown(rules: ReplaceRule[]): { code: { include: RegExp } } | null {
  const importStrings = new Set<string>()

  // Extract all import strings from rules
  for (const rule of rules) {
    extractImportStrings(rule.call.match.function, importStrings)

    if (rule.call.match.args) {
      for (const condition of Object.values(rule.call.match.args)) {
        extractImportStringsFromCondition(condition, importStrings)
      }
    }
  }

  if (importStrings.size === 0) return null

  // Build regex pattern that matches files containing any of the import parts
  const patterns: string[] = []
  for (const importStr of importStrings) {
    if (importStr.startsWith('import:')) {
      const rest = importStr.slice('import:'.length)
      const parts = rest.split(':')
      const exportName = parts.pop()!
      const source = parts.join(':')

      // Match files containing both the source and export name
      patterns.push(`(?=.*${escapeRegex(source)})(?=.*${escapeRegex(exportName)})`)
    }
  }

  if (patterns.length === 0) return null

  // Create a regex that matches if any pattern matches
  const regex = new RegExp(patterns.join('|'))

  return {
    code: {
      include: regex,
    },
  }
}

/**
 * Extract import strings from function patterns
 */
function extractImportStrings(functions: string | string[], result: Set<string>): void {
  const arr = Array.isArray(functions) ? functions : [functions]
  for (const fn of arr) {
    if (fn.startsWith('import:')) {
      result.add(fn)
    }
  }
}

/**
 * Extract import strings from argument conditions
 */
function extractImportStringsFromCondition(condition: any, result: Set<string>): void {
  if (typeof condition === 'string') {
    if (condition.startsWith('import:')) {
      result.add(condition)
    }
  } else if (condition && typeof condition === 'object') {
    // Handle call condition
    if ('call' in condition && typeof condition.call === 'string') {
      if (condition.call.startsWith('import:')) {
        result.add(condition.call)
      }
      // Recursively check nested args
      if (condition.args) {
        for (const nestedCondition of Object.values(condition.args)) {
          extractImportStringsFromCondition(nestedCondition, result)
        }
      }
    }
  }
}
