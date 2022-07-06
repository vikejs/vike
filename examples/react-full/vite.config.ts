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
  // We manually add a list of dependencies to be pre-bundled, in order to avoid a page reload at dev start which breaks vite-plugin-ssr's CI
  // (The 'react/jsx-runtime' entry is not needed in Vite 3 anymore.)
  optimizeDeps: { include: ['cross-fetch', 'react/jsx-runtime'] },
} as UserConfig
