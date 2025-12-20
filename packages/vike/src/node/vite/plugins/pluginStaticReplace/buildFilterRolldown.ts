export { buildFilterRolldown }

import { escapeRegex } from '../../utils.js'
import { type StaticReplace, parseImportString } from './applyStaticReplace.js'

/**
 * Build a filterRolldown from staticReplaceList by extracting all import strings.
 * For a single entry, ALL import strings must be present (AND logic),
 * except for call.match.function array which is OR logic.
 * Between staticReplace entries it's OR logic.
 */
function buildFilterRolldown(staticReplaceList: StaticReplace[]): { code: { include: RegExp } } | null {
  const rulePatterns: string[] = []

  // Process each entry separately
  for (const staticReplaceEntry of staticReplaceList) {
    const importStrings = new Set<string>()
    const functionImportStrings = new Set<string>()

    // Extract function import strings separately
    extractImportStrings(staticReplaceEntry.match.function, functionImportStrings)

    // Extract arg import strings
    if (staticReplaceEntry.match.args) {
      for (const condition of Object.values(staticReplaceEntry.match.args)) {
        extractImportStringsFromCondition(condition, importStrings)
      }
    }

    // Build pattern for this staticReplaceEntry
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

  // Create a regex that matches if any rule pattern matches (OR between staticReplace entries)
  const regex = new RegExp(rulePatterns.join('|'))

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
