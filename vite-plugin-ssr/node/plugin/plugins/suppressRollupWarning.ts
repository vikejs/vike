// Suppress Rollup warnings `Generated an empty chunk: "index.page.server"`

export { suppressRollupWarning }

import type { Plugin } from 'vite'

function suppressRollupWarning(): Plugin {
  return {
    name: 'vite-plugin-ssr:suppressRollupWarning',
    apply: 'build',
    enforce: 'post',
    async configResolved(config) {
      const onWarnOriginal = config.build.rollupOptions.onwarn
      config.build.rollupOptions.onwarn = function (warning, warn) {
        // Suppress
        if (warning.code === 'EMPTY_BUNDLE') return
        // Pass through
        if (onWarnOriginal) {
          onWarnOriginal.apply(this, arguments as any)
        } else {
          warn(warning)
        }
      }
    },
  }
}
