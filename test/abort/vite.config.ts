import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

export default {
  plugins: [
    react(),
    vike({
      redirects: {
        '/permanent-redirect': '/',
        '/external/*': 'https://vite-plugin-ssr.com/*'
      }
    })
  ]
} satisfies UserConfig
