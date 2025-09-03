import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [vue(), vike()],
}

export default config
