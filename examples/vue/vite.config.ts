import vuePlugin from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    vuePlugin(),
    ssr()
  ],
  clearScreen: false
}

export default config
