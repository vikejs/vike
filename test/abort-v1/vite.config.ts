import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import type { UserConfig } from 'vite'

export default {
  plugins: [
    react(),
    ssr({
      redirects: {
        '/permanent-redirect': '/',
        '/external/*': 'https://vite-plugin-ssr.com/*'
      }
    })
  ]
} satisfies UserConfig
