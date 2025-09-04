export { config as default }

import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  plugins: [vike(), vue()],
}
