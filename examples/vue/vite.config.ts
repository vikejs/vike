import vuePlugin from '@vitejs/plugin-vue'
//import vueJsx from '@vitejs/plugin-vue-jsx'
import { plugin as ssr } from 'vite-plugin-ssr'
import { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [
    vuePlugin(),
    //vueJsx(),
    ssr()
  ],
  clearScreen: false
}

export default config
