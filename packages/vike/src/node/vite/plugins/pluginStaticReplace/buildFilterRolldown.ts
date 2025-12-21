export { buildFilterRolldown }

import { escapeRegex } from '../../utils.js'
import type { StaticReplace } from './applyStaticReplace.js'
import { parseImportString } from '../../shared/importString.js'

/**
 * Build a filterRolldown from staticReplaceList by extracting all import strings.
 * For a single entry, ALL import strings must be present (AND logic),
 * except for call.match.function array which is OR logic.
 * Between staticReplace entries it's OR logic.
 *
 * Performance: Uses (?=.*pattern1)(?=.*pattern2).* pattern for AND logic.
 * The trailing .* anchors lookaheads, improving regex engine efficiency.
 */
function buildFilterRolldown(staticReplaceList: StaticReplace[]): RegExp | null {
  const rulePatterns: string[] = []

  // Process each entry separately
  for (const staticReplaceEntry of staticReplaceList) {
    const functionImportStrings = new Set<string>()
    const argImportStrings = new Set<string>()

    // Extract function import strings
    extractImportStrings(staticReplaceEntry.match.function, functionImportStrings)

    // Extract arg import strings
    if (staticReplaceEntry.match.args) {
      for (const condition of Object.values(staticReplaceEntry.match.args)) {
        extractImportStringsFromCondition(condition, argImportStrings)
      }
    }

    // Build pattern for this staticReplaceEntry
    const ruleParts: string[] = []

    // For function imports: if multiple, use OR; each still needs both path and export
    if (functionImportStrings.size > 0) {
      const functionPatterns: string[] = []
      for (const importStr of functionImportStrings) {
        const parts = parseImportString(importStr)
        if (parts) {
          // Match both importPath and exportName (order-independent with lookaheads)
          functionPatterns.push(`(?=.*${escapeRegex(parts.importPath)})(?=.*${escapeRegex(parts.exportName)})`)
        }
      }

      if (functionPatterns.length > 0) {
        // Multiple functions are alternatives (OR)
        if (functionPatterns.length === 1) {
          ruleParts.push(functionPatterns[0]!)
        } else {
          ruleParts.push(`(?:${functionPatterns.join('|')})`)
        }
      }
    }

    // For arg imports: all must be present (AND)
    for (const importStr of argImportStrings) {
      const parts = parseImportString(importStr)
      if (parts) {
        // Each arg import needs both path and export
        ruleParts.push(`(?=.*${escapeRegex(parts.importPath)})(?=.*${escapeRegex(parts.exportName)})`)
      }
    }

    // Combine all parts for this rule with trailing .* to anchor lookaheads
    if (ruleParts.length > 0) {
      rulePatterns.push(ruleParts.join('') + '.*')
    }
  }

  if (rulePatterns.length === 0) return null

  // Create regex with 's' flag (dotAll) to handle multiline files
  // Different rules are alternatives (OR)
  return new RegExp(rulePatterns.join('|'), 's')
}

/**
 * Extract import strings from function patterns
 */
function extractImportStrings(functions: string | string[], result: Set<string>): void {
  const arr = Array.isArray(functions) ? functions : [functions]
  for (const fn of arr) {
    if (parseImportString(fn)) {
      result.add(fn)
    }
  }
}

/**
 * Extract import strings from argument conditions
 */
function extractImportStringsFromCondition(condition: any, result: Set<string>): void {
  if (typeof condition === 'string') {
    if (parseImportString(condition)) {
      result.add(condition)
    }
  } else if (condition && typeof condition === 'object') {
    // Handle call condition
    if ('call' in condition && typeof condition.call === 'string') {
      if (parseImportString(condition.call)) {
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
