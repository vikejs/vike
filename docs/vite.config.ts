import docpressConfig from '@brillout/docpress/vite-config'
import svgr from 'vite-plugin-svgr'
import type { UserConfig } from 'vite'

export default {
  ...docpressConfig,
  plugins: [
    ...docpressConfig.plugins!,
    // Used by the landing page, see `.svg?react` imports
    svgr()
  ]
} satisfies UserConfig
