export { buildFilterRolldown }

import type { StaticReplace } from './applyStaticReplace.js'
import { parseImportString } from '../../shared/importString.js'

/**
 * Build a filterRolldown from staticReplaceList by extracting all import strings.
 * For a single entry, ALL import strings must be present (AND logic),
 * except for call.match.function array which is OR logic.
 * Between staticReplace entries it's OR logic.
 *
 * Performance: Uses string.includes() instead of regex with lookaheads for 10-100x speedup.
 */
function buildFilterRolldown(staticReplaceList: StaticReplace[]): RegExp | null {
  type ImportParts = { importPath: string; exportName: string }
  type RuleCondition = {
    functionAlternatives: ImportParts[][] // OR of ANDs
    requiredImports: ImportParts[] // All must be present
  }

  const rules: RuleCondition[] = []

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

    // Parse import strings into parts
    const functionAlternatives: ImportParts[][] = []
    for (const importStr of functionImportStrings) {
      const parts = parseImportString(importStr)
      if (parts) {
        functionAlternatives.push([parts])
      }
    }

    const requiredImports: ImportParts[] = []
    for (const importStr of argImportStrings) {
      const parts = parseImportString(importStr)
      if (parts) {
        requiredImports.push(parts)
      }
    }

    if (functionAlternatives.length > 0 || requiredImports.length > 0) {
      rules.push({ functionAlternatives, requiredImports })
    }
  }

  if (rules.length === 0) return null

  // Create a custom RegExp subclass with optimized string matching
  // This is 10-100x faster than regex with lookaheads
  class OptimizedFilter extends RegExp {
    constructor() {
      // Use a dummy pattern for the base RegExp
      super('', 's')
    }

    test(code: string): boolean {
      // Try each rule (OR logic between rules)
      for (const rule of rules) {
        let ruleMatches = true

        // Check if at least one function alternative matches (OR logic)
        if (rule.functionAlternatives.length > 0) {
          const anyFunctionMatches = rule.functionAlternatives.some((parts) =>
            parts.every((part) => code.includes(part.importPath) && code.includes(part.exportName)),
          )
          if (!anyFunctionMatches) {
            ruleMatches = false
            continue
          }
        }

        // Check if all required imports are present (AND logic)
        if (rule.requiredImports.length > 0) {
          const allRequiredPresent = rule.requiredImports.every(
            (part) => code.includes(part.importPath) && code.includes(part.exportName),
          )
          if (!allRequiredPresent) {
            ruleMatches = false
            continue
          }
        }

        if (ruleMatches) return true
      }

      return false
    }
  }

  return new OptimizedFilter()
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
