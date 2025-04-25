import svgr from 'vite-plugin-svgr'
import type { UserConfig } from 'vite'

export default {
  optimizeDeps: { include: ['@batijs/elements'] },
  plugins: [
    // Used by the landing page, see `.svg?react` imports
    svgr()
  ],
  // https://github.com/vikejs/vike/blob/08a1ff55c80ddca64ca6d4417fefd45fefeb4ffb/vike/node/plugin/plugins/replaceConstants.ts#L32
  // @ts-expect-error
  _skipVikeReplaceConstants: (id: string) => id.endsWith('.mdx')
} satisfies UserConfig
