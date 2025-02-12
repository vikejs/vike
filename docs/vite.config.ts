import svgr from 'vite-plugin-svgr'
import type { UserConfig } from 'vite'

export default {
  plugins: [
    // Used by the landing page, see `.svg?react` imports
    svgr()
  ]
} satisfies UserConfig
