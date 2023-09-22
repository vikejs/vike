import react from '@vitejs/plugin-react'
import ssr from 'vike/plugin'

export default {
  plugins: [react(), ssr()],
  build: {
    outDir: 'my-custom-build-dir'
  }
}
