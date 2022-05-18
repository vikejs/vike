import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'

export default {
  plugins: [
    react(),
    mdx(),
    ssr({
      prerender: true,
    }),
  ],
  optimizeDeps: { include: ['react/jsx-runtime'] },
} as UserConfig
