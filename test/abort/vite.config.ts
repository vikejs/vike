import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

export default {
  plugins: [
    react(),
    vike({
      redirects: {
        '/permanent-redirect': '/',
        '/star-wars-api/*': 'https://brillout.github.io/star-wars/api/*'
      }
    })
  ]
} satisfies UserConfig
