import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'

export default {
  plugins: [react(), ssr()],
  build: {
    outDir: 'my-custom-build-dir'
  }
}
