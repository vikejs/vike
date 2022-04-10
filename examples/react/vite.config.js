import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'

export default {
  plugins: [react(), ssr()],
  ...serverConfig(),
}

function serverConfig() {
  const port = 3000
  // Needed for vite-plugin-ssr's CI
  const host = process.env.CI && process.platform === 'darwin'
  return {
    preview: { port, host },
    server: { port, host },
  }
}
