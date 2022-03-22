export { misc }

import type { Plugin } from 'vite'

function misc(): Plugin {
  return {
    name: 'vite-plugin-ssr:misc',
    apply: 'build',
    enforce: 'post',
    async configResolved(config) {
      const onWarnOriginal = config.build.rollupOptions.onwarn
      config.build.rollupOptions.onwarn = function (warning, warn) {
        // Skip warnings `Generated an empty chunk: "index.page.server"`
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
