import mdx from '@mdx-js/rollup'
import type { UserConfig } from 'vite'

export default {
  // TEST: use +vite to add Vite plugin
  plugins: [mdx()],
} satisfies UserConfig
