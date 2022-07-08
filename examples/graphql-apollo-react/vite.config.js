const react = require('@vitejs/plugin-react')
const ssr = require('vite-plugin-ssr/plugin')

const config = {
  plugins: [react(), ssr()],
  clearScreen: false,
}

export default config
