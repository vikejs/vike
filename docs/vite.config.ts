import svgr from 'vite-plugin-svgr'
import type { UserConfig } from 'vite'

export default {
  optimizeDeps: { include: ['@batijs/elements'] },
  plugins: [
    // Used by the landing page, see `.svg?react` imports
    svgr()
  ],
  // @ts-expect-error
  _skipVikeReplaceConstants: (id: string) => id.endsWith('.mdx')
} satisfies UserConfig
