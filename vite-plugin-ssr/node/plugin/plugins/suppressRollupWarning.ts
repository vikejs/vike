// Suppress Rollup warnings `Generated an empty chunk: "index.page.server"`

export { suppressRollupWarning }

import type { Plugin } from 'vite'
import type { RollupWarning } from 'rollup'

function suppressRollupWarning(): Plugin {
  return {
    name: 'vite-plugin-ssr:suppressRollupWarning',
    apply: 'build',
    enforce: 'post',
    async configResolved(config) {
      const onWarnOriginal = config.build.rollupOptions.onwarn
      config.build.rollupOptions.onwarn = function (warning, warn) {
        // Suppress
        if (suppressUnusedImport(warning)) return
        if (suppressEmptyBundle(warning)) return
        if (suppressUseClientDirective(warning)) return

        // Pass through
        if (onWarnOriginal) {
          onWarnOriginal.apply(this, arguments as any)
        } else {
          warn(warning)
        }
      }
    }
  }
}

/** Suppress warning about Rollup removing the React Server Components `"use client";` directives */
function suppressUseClientDirective(warning: RollupWarning) {
  return warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')
}

/** Suppress warning about generating emtpy chunks in dist/ */
function suppressEmptyBundle(warning: RollupWarning) {
  return warning.code === 'EMPTY_BUNDLE'
}

/** Suppress warning about unused import statements */
function suppressUnusedImport(warning: RollupWarning & { ids?: string[] }): boolean {
  if (warning.code !== 'UNUSED_EXTERNAL_IMPORT') return false
  // I guess it's expected that JSX contains unsused `import React from 'react'`
  if (warning.exporter === 'react' && warning.names?.includes('default')) return true
  // If some library does something unexpected, we suppress since it isn't actionable
  if (warning.ids?.some((id) => id.includes('/node_modules/'))) return true
  return false
}
