import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import type { UserConfig } from 'vite'

export default {
  plugins: [
    react(),
    ssr({
      pageFiles: {
        addPageFiles: [
          'stem-react/renderer/_default.page.server.js',
          'stem-react/renderer/_default.page.client.js'
        ]
      }
    })
  ],
  ssr: { external: [
    'stem-react',
    'stem-react/dist/renderer/_default.page.server.js',
    'stem-react/renderer/_default.page.server.js'
  ] }
} as UserConfig
