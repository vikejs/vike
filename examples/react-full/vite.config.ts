import react from '@vitejs/plugin-react-swc'
import mdx from '@mdx-js/rollup'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

export default {
  plugins: [(async () => vike())(), mdx(), react()],
} satisfies UserConfig
