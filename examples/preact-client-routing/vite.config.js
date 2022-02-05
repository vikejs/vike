import preact from '@preact/preset-vite'
import ssr from 'vite-plugin-ssr/plugin'

const config = {
  plugins: [preact(), ssr()],
}

export default config
