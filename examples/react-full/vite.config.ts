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
