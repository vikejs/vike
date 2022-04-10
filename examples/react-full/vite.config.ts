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
  resolve: {
    alias: {
      // Needed for MDX, see https://github.com/mdx-js/mdx/discussions/1794#discussioncomment-1581513
      'react/jsx-runtime': 'react/jsx-runtime.js',
    },
  },
  optimizeDeps: { include: ['react/jsx-runtime.js'] },
  ...serverConfig(),
} as UserConfig

function serverConfig() {
  const port = 3000
  // Needed for vite-plugin-ssr's CI
  const host = process.env.CI && process.platform === 'darwin'
  return {
    preview: { port, host },
    server: { port, host },
  }
}
