import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  resolve: {
    alias: {
      '#root': __dirname
    }
  },
  plugins: [
    react(),
    ssr({
      includeAssetsImportedByServer: true,
      prerender: true
    })
  ],
  optimizeDeps: {
    include: ['react-dom/client']
  }
}

export default config
