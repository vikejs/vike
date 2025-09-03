export { createHookFilters }
export type { HookFilters }

import { isVirtualFileId } from '../../../utils/virtualFileId.js'
import { isScriptFile } from '../../../utils/isScriptFile.js'
import { extractAssetsRE } from '../plugins/pluginExtractAssets.js'

/**
 * Hook filter patterns for Rolldown/Rollup hook optimization.
 * These filters reduce JavaScript-Rust communication overhead by
 * filtering files at the Rust level before calling JavaScript hooks.
 */
type HookFilters = {
  resolveId?: {
    id?: RegExp
  }
  load?: {
    id?: RegExp
  }
  transform?: {
    id?: RegExp
  }
}

/**
 * Creates common hook filter patterns used across Vike plugins.
 * These filters help optimize performance with Rolldown by reducing
 * the number of files that need to be processed by JavaScript hooks.
 */
function createHookFilters() {
  return {
    /**
     * Filter for virtual file IDs (e.g., virtual:vike:*)
     */
    virtualFiles: {
      resolveId: { id: /^virtual:vike:/ },
      load: { id: /^virtual:vike:/ }
    } satisfies HookFilters,

    /**
     * Filter for files with extractAssets query parameter
     */
    extractAssets: {
      resolveId: { id: /[?&]extractAssets(?:&|$)/ },
      transform: { id: /[?&]extractAssets(?:&|$)/ }
    } satisfies HookFilters,

    /**
     * Filter for script files (JS, TS, JSX, TSX, etc.)
     * Excludes node_modules for performance
     */
    scriptFiles: {
      transform: { id: /\.(js|ts|jsx|tsx|mjs|cjs)(\?|$)/ }
    } satisfies HookFilters,

    /**
     * Filter for files that are NOT in node_modules
     * Useful for plugins that should only process user code
     */
    userFiles: {
      transform: { id: /^(?!.*\/node_modules\/).*/ }
    } satisfies HookFilters,

    /**
     * Filter for files with extractExportNames query parameter
     */
    extractExportNames: {
      transform: { id: /[?&]extractExportNames(?:&|$)/ }
    } satisfies HookFilters,

    /**
     * Filter for CSS files
     */
    cssFiles: {
      transform: { id: /\.css(\?|$)/ }
    } satisfies HookFilters,

    /**
     * Filter for files that contain import.meta.env
     * This is a heuristic filter - the actual check happens in the hook
     */
    envFiles: {
      transform: { id: /\.(js|ts|jsx|tsx|vue|svelte)(\?|$)/ }
    } satisfies HookFilters,

    /**
     * Combines multiple filters with AND logic
     */
    combine: (...filters: HookFilters[]): HookFilters => {
      const combined: HookFilters = {}
      
      for (const filter of filters) {
        for (const [hookName, hookFilter] of Object.entries(filter) as [keyof HookFilters, any][]) {
          if (!combined[hookName]) {
            combined[hookName] = {}
          }
          
          if (hookFilter.id) {
            if (combined[hookName]!.id) {
              // Combine regexes with AND logic by creating a new regex that matches both
              const regex1 = combined[hookName]!.id!
              const regex2 = hookFilter.id
              combined[hookName]!.id = new RegExp(`(?=${regex1.source})(?=${regex2.source})`)
            } else {
              combined[hookName]!.id = hookFilter.id
            }
          }
        }
      }
      
      return combined
    }
  }
}

/**
 * Helper function to check if a file ID matches a filter pattern
 * Useful for backward compatibility checks in hook implementations
 */
export function matchesFilter(id: string, filter: { id?: RegExp }): boolean {
  if (!filter.id) return true
  return filter.id.test(id)
}

/**
 * Helper function to create a filter that excludes node_modules
 * and only processes files within the project root
 */
export function createProjectFileFilter(projectRoot: string): { id: RegExp } {
  // Normalize path separators and escape for regex
  const normalizedRoot = projectRoot.replace(/\\/g, '/').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return {
    id: new RegExp(`^${normalizedRoot}/(?!.*node_modules/).*\\.(js|ts|jsx|tsx|vue|svelte)(\\\?|$)`)
  }
}
