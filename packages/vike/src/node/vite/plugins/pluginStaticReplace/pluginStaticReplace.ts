export { pluginStaticReplace }
export { buildFilterRolldown }
export { getAllRules }

import type { Plugin, ResolvedConfig } from 'vite'
import { assert, escapeRegex } from '../../utils.js'
import { isViteServerSide_extraSafe } from '../../shared/isViteServerSide.js'
import { VikeConfigInternal } from '../../shared/resolveVikeConfigInternal.js'
import { transformStaticReplace, type StaticReplace, type ReplaceRule } from '../pluginStaticReplace.js'

function pluginStaticReplace(vikeConfig: VikeConfigInternal): Plugin[] {
  let config: ResolvedConfig
  const rules = getAllRules(vikeConfig)
  if (rules.length === 0) return []
  const filterRolldown = buildFilterRolldown(rules)
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
        filter: filterRolldown || undefined,
        async handler(code, id, options) {
          if (!rules || rules.length === 0) return null
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
 * Extract all rules from vikeConfig
 */
function getAllRules(vikeConfig: VikeConfigInternal): ReplaceRule[] {
  const staticReplaceConfigs = vikeConfig._from.configsCumulative.staticReplace
  if (!staticReplaceConfigs) return []

  const allRules: ReplaceRule[] = []

  for (const configValue of staticReplaceConfigs.values) {
    const options = configValue.value as StaticReplace
    if (options?.rules) {
      allRules.push(...options.rules)
    }
  }

  return allRules
}

/**
 * Build a filterRolldown from rules by extracting all import strings.
 * For a single rule, ALL import strings must be present (AND logic),
 * except for call.match.function array which is OR logic.
 * Between rules, it's OR logic.
 */
function buildFilterRolldown(rules: ReplaceRule[]): { code: { include: RegExp } } | null {
  const rulePatterns: string[] = []

  // Process each rule separately
  for (const rule of rules) {
    const importStrings = new Set<string>()
    const functionImportStrings = new Set<string>()

    // Extract function import strings separately
    extractImportStrings(rule.call.match.function, functionImportStrings)

    // Extract arg import strings
    if (rule.call.match.args) {
      for (const condition of Object.values(rule.call.match.args)) {
        extractImportStringsFromCondition(condition, importStrings)
      }
    }

    // Build pattern for this rule
    const ruleParts: string[] = []

    // For function imports: if array, use OR; otherwise use AND
    if (functionImportStrings.size > 0) {
      const functionPatterns: string[] = []
      for (const importStr of functionImportStrings) {
        const parts = parseImportString(importStr)
        if (parts) {
          // Each function import should match both source and export name
          functionPatterns.push(`(?=.*${escapeRegex(parts.source)})(?=.*${escapeRegex(parts.exportName)})`)
        }
      }

      // If multiple functions, they are alternatives (OR)
      if (functionPatterns.length > 0) {
        if (functionPatterns.length === 1) {
          ruleParts.push(functionPatterns[0]!)
        } else {
          // Multiple function patterns: file must match at least one
          ruleParts.push(`(?:${functionPatterns.join('|')})`)
        }
      }
    }

    // For arg imports: all must be present (AND)
    for (const importStr of importStrings) {
      const parts = parseImportString(importStr)
      if (parts) {
        // Each arg import should match both source and export name
        ruleParts.push(`(?=.*${escapeRegex(parts.source)})(?=.*${escapeRegex(parts.exportName)})`)
      }
    }

    // Combine all parts for this rule with AND logic
    if (ruleParts.length > 0) {
      // All parts must match for this rule
      rulePatterns.push(ruleParts.join(''))
    }
  }

  if (rulePatterns.length === 0) return null

  // Create a regex that matches if any rule pattern matches (OR between rules)
  const regex = new RegExp(rulePatterns.join('|'))

  return {
    code: {
      include: regex,
    },
  }
}

function parseImportString(str: string): { source: string; exportName: string } | null {
  if (!str.startsWith('import:')) return null
  const rest = str.slice('import:'.length)
  const parts = rest.split(':')
  const exportName = parts.pop()!
  const source = parts.join(':')
  return { source, exportName }
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
