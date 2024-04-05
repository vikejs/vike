import vue from '@vitejs/plugin-vue'
import vike from 'vike/plugin'

export default {
  define: { __VUE_OPTIONS_API__: false },
  plugins: [vue(), vike()]
}
