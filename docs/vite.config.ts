import svgr from 'vite-plugin-svgr'
import type { UserConfig } from 'vite'

export default {
  optimizeDeps: { include: ['@batijs/elements'] },
  plugins: [
    // Used by the landing page, see `.svg?react` imports
    svgr()
  ],
  // https://github.com/vikejs/vike/blob/c05419613fa900d6e14aa1f1e8a68e8b350deb61/vike/node/plugin/plugins/replaceConstants.ts#L30
  // @ts-expect-error
  _skipVikeReplaceConstants: (id: string) => id.endsWith('.mdx')
} satisfies UserConfig
