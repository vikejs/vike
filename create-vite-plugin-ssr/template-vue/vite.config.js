import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr'

const config = {
  plugins: [vue(), ssr()]
}

export default config
