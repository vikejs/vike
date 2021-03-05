import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr'

export default {
  plugins: [vue(), ssr()]
}
