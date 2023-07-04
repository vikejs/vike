import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  resolve: {
    alias: {
      // We prefix path aliases with '#', see https://vite-plugin-ssr.com/path-aliases#vite
      '#root': __dirname
    }
  },
  plugins: [
    react(),
    ssr({
      prerender: true
    })
  ]
}

export default config
