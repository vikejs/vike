import vue from '@vitejs/plugin-vue'
import md from 'vite-plugin-md'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    md(),
    ssr()
  ],
  clearScreen: false
}

export default config
