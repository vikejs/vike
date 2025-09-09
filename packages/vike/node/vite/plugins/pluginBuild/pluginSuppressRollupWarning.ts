// Suppress Rollup warnings `Generated an empty chunk: "index.page.server"`

export { pluginSuppressRollupWarning }

import type { Plugin, Rollup } from 'vite'
type RollupLog = Rollup.RollupLog

function pluginSuppressRollupWarning(): Plugin[] {
  return [{
    name: 'vike:build:pluginSuppressRollupWarning',
    apply: 'build',
    enforce: 'post',
    configResolved: {
      async handler(config) {
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
      },
    },
  }]
}

/** Suppress warning about Rollup removing the React Server Components `"use client";` directives */
function suppressUseClientDirective(warning: RollupLog) {
  return warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')
}

/** Suppress warning about generating empty chunks in dist/ */
function suppressEmptyBundle(warning: RollupLog) {
  return warning.code === 'EMPTY_BUNDLE'
}

/** Suppress warning about unused import statements */
function suppressUnusedImport(warning: RollupLog & { ids?: string[] }): boolean {
  if (warning.code !== 'UNUSED_EXTERNAL_IMPORT') return false

  // I guess it's expected that JSX contains unused `import React from 'react'`
  if (warning.exporter === 'react' && warning.names?.includes('default')) {
    warning.names = warning.names.filter((n) => n !== 'default')
    if (warning.names.length === 0) return true
  }

  // Suppress:
  // ```
  // "untrack" is imported from external module "solid-js" but never used in "pages/star-wars/index/+Page.tsx", "pages/index/Counter.tsx", "components/Link.tsx", "pages/todo/TodoList.tsx" and "pages/todo/+Page.tsx".
  // ```
  // I'm guessing Solid's transformer injects `import { untrack } from 'solid-js'`
  if (warning.exporter === 'solid-js' && warning.names?.includes('untrack')) {
    warning.names = warning.names.filter((n) => n !== 'untrack')
    if (warning.names.length === 0) return true
  }

  // If some library does something unexpected, we suppress since it isn't actionable
  if (warning.ids?.every((id) => id.includes('/node_modules/'))) return true

  return false
}
