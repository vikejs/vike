import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  resolve: {
    alias: {
      '#root': __dirname,
    },
  },
  plugins: [vike(), react()],
  optimizeDeps: {
    include: ['react-dom/client'],
  },
}

export default config
